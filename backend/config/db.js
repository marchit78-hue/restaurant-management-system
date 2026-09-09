const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (
    cachedConnection &&
    mongoose.connection.readyState === 1
  ) {
    return cachedConnection;
  }

  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    mongoUri = process.env.MONGO_URI;
  }

  if (!mongoUri) {
    throw new Error(
      'No MongoDB environment variable found. Expected MONGODB_URI or MONGO_URI.'
    );
  }

  mongoUri = String(mongoUri).trim();

  // Remove accidental surrounding quotes
  mongoUri = mongoUri.replace(/^["']|["']$/g, '').trim();

  // Remove accidental variable-name prefixes
  mongoUri = mongoUri.replace(
    /^(MONGO_URI|MONGODB_URI)\s*=\s*/i,
    ''
  ).trim();

  const startsWithMongo =
    mongoUri.startsWith('mongodb://');

  const startsWithMongoSrv =
    mongoUri.startsWith('mongodb+srv://');

  if (!startsWithMongo && !startsWithMongoSrv) {
    throw new Error(
      `Invalid MongoDB URI. First characters received: ${JSON.stringify(
        mongoUri.substring(0, 40)
      )}`
    );
  }

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