const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const dotenv = require('dotenv');

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

const createAdmin = async () => {
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

    // Only one admin is allowed.
    const existingAdmin =
      await User.findOne({
        role: 'admin',
      });

    if (existingAdmin) {
      console.log(
        '\n❌ An admin account already exists.'
      );

      console.log(
        `Admin Name: ${existingAdmin.name}`
      );

      console.log(
        `Admin User ID: ${existingAdmin.userId}`
      );

      console.log(
        `Admin Phone: ${existingAdmin.phone}`
      );

      console.log(
        '\nOnly one admin account is allowed.'
      );

      rl.close();
      await mongoose.disconnect();
      return;
    }

    const name = await question(
      'Admin Name: '
    );

    const phone = await question(
      'Admin Phone Number: '
    );

    const userId = await question(
      'Admin User ID: '
    );

    const password = await question(
      'Admin Password: '
    );

    if (
      !name.trim() ||
      !phone.trim() ||
      !userId.trim() ||
      !password
    ) {
      console.log(
        '\n❌ All fields are required.'
      );

      rl.close();
      await mongoose.disconnect();
      return;
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanUserId = userId.trim();

    // Phone validation
    if (!/^\d{10}$/.test(cleanPhone)) {
      console.log(
        '\n❌ Admin phone number must contain exactly 10 digits.'
      );

      rl.close();
      await mongoose.disconnect();
      return;
    }

    // Password validation
    if (password.length < 6) {
      console.log(
        '\n❌ Password must contain at least 6 characters.'
      );

      rl.close();
      await mongoose.disconnect();
      return;
    }

    // User ID validation
    if (cleanUserId.length < 3) {
      console.log(
        '\n❌ Admin User ID must contain at least 3 characters.'
      );

      rl.close();
      await mongoose.disconnect();
      return;
    }

    // User IDs are treated as case-insensitive.
    // This prevents duplicate IDs such as:
    // Arch-restaurant
    // arch-restaurant
    // ARCH-RESTAURANT
    const existingUser =
      await User.findOne({
        $or: [
          {
            phone: cleanPhone,
          },
          {
            userId: {
              $regex: `^${escapeRegex(
                cleanUserId
              )}$`,
              $options: 'i',
            },
          },
        ],
      });

    if (existingUser) {
      console.log(
        '\n❌ This phone number or User ID is already registered.'
      );

      console.log(
        `Existing account role: ${existingUser.role}`
      );

      rl.close();
      await mongoose.disconnect();
      return;
    }

    // Secure password hashing
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const admin =
      await User.create({
        name: cleanName,
        phone: cleanPhone,
        userId: cleanUserId,
        password: hashedPassword,
        role: 'admin',
      });

    console.log(
      '\n✅ Admin account created successfully!'
    );

    console.log(
      '--------------------------------'
    );

    console.log(
      `Name: ${admin.name}`
    );

    console.log(
      `Phone: ${admin.phone}`
    );

    console.log(
      `User ID: ${admin.userId}`
    );

    console.log(
      `Role: ${admin.role}`
    );

    console.log(
      '--------------------------------'
    );

    console.log(
      '\nYou can now log in from the Admin Login option.'
    );

    console.log(
      '\n⚠️ Keep the Admin User ID and password private.\n'
    );

    rl.close();
    await mongoose.disconnect();

  } catch (error) {
    console.error(
      '\n❌ Error creating admin:',
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


// Escape special characters before using a value in RegExp.
function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
}

createAdmin();