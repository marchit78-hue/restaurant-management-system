const mongoose = require('mongoose');

let cachedConnection = null;

const buildMongoUri = () => {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not configured');
  }

  uri = String(uri).trim();

  // Remove accidental surrounding quotes
  uri = uri.replace(/^["']|["']$/g, '').trim();

  // Remove accidental MONGO_URI= prefix
  uri = uri.replace(/^MONGO_URI\s*=\s*/i, '').trim();

  if (
    !uri.startsWith('mongodb://') &&
    !uri.startsWith('mongodb+srv://')
  ) {
    throw new Error(
      'MONGO_URI must start with mongodb:// or mongodb+srv://'
    );
  }

  /*
   * Handle Atlas mongodb:// connection strings whose
   * password contains special characters such as @.
   *
   * Example:
   * mongodb://username:password@host1:27017,host2:27017/db?... 
   *
   * We extract the credentials using the LAST @, so an @
   * inside the password does not break the connection.
   */
  if (uri.startsWith('mongodb://')) {
    const withoutScheme = uri.substring('mongodb://'.length);

    const atIndex = withoutScheme.lastIndexOf('@');

    if (atIndex === -1) {
      throw new Error(
        'MONGO_URI mongodb:// connection string is missing credentials separator'
      );
    }

    const credentials = withoutScheme.substring(
      0,
      atIndex
    );

    const remainder = withoutScheme.substring(
      atIndex + 1
    );

    const colonIndex = credentials.indexOf(':');

    if (colonIndex === -1) {
      throw new Error(
        'MONGO_URI credentials are invalid'
      );
    }

    const username = credentials.substring(
      0,
      colonIndex
    );

    const password = credentials.substring(
      colonIndex + 1
    );

    /*
     * Use the first Atlas shard hostname and convert
     * the old replica-set URI into Atlas SRV format.
     */
    const firstHost = remainder.split(',')[0];

    const atlasHostMatch = firstHost.match(
      /^([^.]+)\.[^.]+\.mongodb\.net/
    );

    if (atlasHostMatch) {
      const clusterPrefix = atlasHostMatch[1].replace(
        /-shard-00-00$/,
        ''
      );

      const domain = firstHost.substring(
        firstHost.indexOf('.') + 1
      );

      const clusterHost =
        `${clusterPrefix}.${domain}`;

      const databaseMatch = remainder.match(
        /\/([^?]+)/
      );

      const database =
        databaseMatch?.[1] || 'test';

      uri =
        `mongodb+srv://${encodeURIComponent(username)}` +
        `:${encodeURIComponent(password)}` +
        `@${clusterHost}/${database}` +
        `?appName=arch-restaurant`;
    } else {
      /*
       * If it isn't an Atlas shard URI, preserve the
       * original URI but safely encode credentials.
       */
      const databaseAndOptions =
        remainder.substring(
          remainder.indexOf('/')
        );

      uri =
        `mongodb://${encodeURIComponent(username)}` +
        `:${encodeURIComponent(password)}` +
        `@${remainder.substring(
          0,
          remainder.indexOf('/')
        )}` +
        databaseAndOptions;
    }
  }

  return uri;
};

const connectDB = async () => {
  if (
    cachedConnection &&
    mongoose.connection.readyState === 1
  ) {
    return cachedConnection;
  }

  const mongoUri = buildMongoUri();

  try {
    cachedConnection = await mongoose.connect(
      mongoUri,
      {
        serverSelectionTimeoutMS: 15000,
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