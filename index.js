const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const path = require('path');
const connectionToDatabase = require('./back-end/config/mongoose');
const taskRoutes = require('./back-end/routes/tasks');

//google auth routes
const passport = require("passport");
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(passport.initialize());
//google auth routes

const authRoutes = require('./back-end/routes/auth');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/tasks", taskRoutes);
// Connect to database and start server

connectionToDatabase();
app.listen(process.env.PORT || 5000, () => {
  console.log('Listening to port :', process.env.PORT || 5000);
});
