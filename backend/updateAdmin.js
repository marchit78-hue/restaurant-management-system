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

const updateAdmin = async () => {
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

    const admin = await User.findOne({
      role: 'admin',
    });

    if (!admin) {
      console.log(
        '\n❌ No admin account was found.'
      );

      rl.close();
      await mongoose.disconnect();
      return;
    }

    console.log(
      'Existing admin account found.'
    );

    console.log(
      `Admin Name: ${admin.name}`
    );

    console.log(
      `Admin User ID: ${admin.userId}`
    );

    console.log(
      `Admin Phone: ${admin.phone}`
    );

    console.log(
      `Admin Role: ${admin.role}`
    );

    console.log(
      '\n--------------------------------'
    );

    const newPassword = await question(
      'Enter NEW Admin Password: '
    );

    if (!newPassword) {
      console.log(
        '\n❌ Password cannot be empty.'
      );

      rl.close();
      await mongoose.disconnect();
      return;
    }

    if (newPassword.length < 6) {
      console.log(
        '\n❌ Password must contain at least 6 characters.'
      );

      rl.close();
      await mongoose.disconnect();
      return;
    }

    const confirmPassword = await question(
      'Confirm NEW Admin Password: '
    );

    if (newPassword !== confirmPassword) {
      console.log(
        '\n❌ Passwords do not match.'
      );

      rl.close();
      await mongoose.disconnect();
      return;
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12
      );

    admin.password = hashedPassword;

    await admin.save();

    console.log(
      '\n✅ Admin password updated successfully!'
    );

    console.log(
      '--------------------------------'
    );

    console.log(
      `Admin User ID: ${admin.userId}`
    );

    console.log(
      `Admin Name: ${admin.name}`
    );

    console.log(
      `Admin Phone: ${admin.phone}`
    );

    console.log(
      `Role: ${admin.role}`
    );

    console.log(
      'Password: Updated securely'
    );

    console.log(
      '--------------------------------'
    );

    console.log(
      '\nYour existing admin account is ready.'
    );

    console.log(
      'Use the Admin User ID shown above and the NEW password to log in.'
    );

    console.log(
      '\nDo not share the password.\n'
    );

    rl.close();
    await mongoose.disconnect();

  } catch (error) {
    console.error(
      '\n❌ Error updating admin:',
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

updateAdmin();