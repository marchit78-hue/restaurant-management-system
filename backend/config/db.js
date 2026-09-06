const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  try {
    cachedConnection = await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000,
      }
    );

    console.log(
      `MongoDB connected successfully: ${cachedConnection.connection.host}`
    );

    return cachedConnection;
  } catch (error) {
    cachedConnection = null;

    console.error(
      'MongoDB connection failed:',
      error.message
    );

    throw error;
  }
};

module.exports = connectDB;
