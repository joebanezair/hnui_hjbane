const mongoose = require('mongoose');
const connectionToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ - MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectionToDatabase; // ✅ export the function so server.js can use it
