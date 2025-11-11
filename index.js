const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const connectionToDatabase = require('./back-end/config/mongoose');
app.use(cors());

const authRoutes = require('./back-end/routes/auth');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);

connectionToDatabase();
app.listen(process.env.PORT || 5000, () => {
  console.log('Listening to port :', process.env.PORT || 5000);
});
