const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const router = express.Router();
const authen = require('../middleware/auth');

// Google Import
const passport = require("passport");
const querystring = require("querystring");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// Google Import

// Google OAuth strategy
// const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const user = await User.findById(decoded.id);
    
    if (!user) throw new Error();
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Configure Google OAuth strategy
// routes/auth.jsx
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_BASE_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Derive first/last from displayName
        let firstName = "";
        let lastName = "";
        if (profile.displayName) {
          const parts = profile.displayName.split(" ");
          firstName = parts[0] || "";
          lastName = parts.slice(1).join(" ") || "";
        }

        const email = profile.emails?.[0]?.value;
        // Find by email (since your schema doesn’t have googleId)
        let user = await User.findOne({ email });

        if (!user) {
          // Create a user compatible with your schema
          user = await User.create({
            firstName,
            lastName,
            email,
            // Generate a placeholder password to satisfy required field;
            // it will be hashed by your pre-save hook.
            password: `${profile.id}:${Date.now()}`,
            resetToken: { token: null, used: false, expiresAt: null },
          });
        }

        return done(null, {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Return JSON with Google OAuth URL
router.get("/google", (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${querystring.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.API_BASE_URL}/api/auth/google/callback`,
    response_type: "code",
    scope: "profile email",
  })}`;
  res.json({ redirectUrl: googleAuthUrl });
});

// Callback → issue JWT
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const u = req.user;

    const token = jwt.sign(
      {
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        // Password not included in JWT for security; resets kept null by default
        resetToken: { token: null, used: false, expiresAt: null },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);
// Google OAuth configuration

router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const user = new User({ email, password, firstName, lastName });
    await user.save();

    const token = jwt.sign({ id: user._id },  
     process.env.JWT_SECRET, { expiresIn: '1hr' });
    
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id },
       process.env.JWT_SECRET,
      { expiresIn: '1hr' });
    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/profile', authen, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

