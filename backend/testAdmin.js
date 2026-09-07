const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const readline = require('readline');

const User = require('./models/User');

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text) => {
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
};

const testAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        'MONGO_URI is not configured.'
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log('\nConnected to MongoDB.\n');

    const loginId = await question(
      'Admin User ID: '
    );

    const password = await question(
      'Admin Password: '
    );

    const cleanLoginId = loginId.trim();

    const escapedId = cleanLoginId.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const admin = await User.findOne({
      userId: {
        $regex: `^${escapedId}$`,
        $options: 'i',
      },
      role: 'admin',
    });

    console.log('\n==============================');

    console.log(
      'Admin found:',
      !!admin
    );

    if (!admin) {
      console.log(
        '❌ No admin account matched this User ID.'
      );

      console.log(
        '==============================\n'
      );

      rl.close();
      await mongoose.disconnect();
      return;
    }

    console.log(
      'Stored User ID:',
      admin.userId
    );

    console.log(
      'Stored Role:',
      admin.role
    );

    const passwordMatches =
      await bcrypt.compare(
        password,
        admin.password
      );

    console.log(
      'Password matches:',
      passwordMatches
    );

    console.log('==============================\n');

    if (passwordMatches) {
      console.log(
        '✅ DATABASE AUTHENTICATION IS WORKING.'
      );

      console.log(
        'The admin ID and password are valid.'
      );
    } else {
      console.log(
        '❌ DATABASE AUTHENTICATION FAILED.'
      );

      console.log(
        'The stored password does not match.'
      );
    }

    console.log('');

    rl.close();
    await mongoose.disconnect();

  } catch (error) {
    console.error(
      '\n❌ ERROR:',
      error.message
    );

    rl.close();

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      // Ignore disconnect errors
    }
  }
};

testAdmin();