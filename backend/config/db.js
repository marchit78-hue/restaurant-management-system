const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant_management';
    const conn = await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection failed with configured URI:', error.message);

    try {
      const memoryServer = await MongoMemoryServer.create();
      const mongoUri = memoryServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log('MongoDB connected successfully');
      console.log('Using in-memory MongoDB fallback because no local MongoDB server was detected.');
      return conn;
    } catch (memoryError) {
      console.error('MongoDB connection failed:', memoryError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
