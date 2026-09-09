const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (
    cachedConnection &&
    mongoose.connection.readyState === 1
  ) {
    return cachedConnection;
  }

  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;
  const host = process.env.MONGO_HOST;
  const database =
    process.env.MONGO_DATABASE || 'test';

  const missing = [];

  if (!username) missing.push('MONGO_USERNAME');
  if (!password) missing.push('MONGO_PASSWORD');
  if (!host) missing.push('MONGO_HOST');

  if (missing.length > 0) {
    throw new Error(
      `Missing MongoDB environment variables: ${missing.join(', ')}`
    );
  }

  const mongoUri =
    `mongodb+srv://${encodeURIComponent(username)}:` +
    `${encodeURIComponent(password)}@${host}/${database}` +
    `?appName=arch-restaurant`;

  try {
    cachedConnection = await mongoose.connect(
      mongoUri,
      {
        serverSelectionTimeoutMS: 10000,
        family: 4,
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