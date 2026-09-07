const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('./models/User');

dotenv.config();

const fixAdminId = async () => {
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

    // Find the single admin account.
    const admin = await User.findOne({
      role: 'admin',
    });

    if (!admin) {
      console.log(
        '❌ No admin account found.'
      );

      await mongoose.disconnect();
      return;
    }

    console.log(
      `Current Admin User ID: ${admin.userId}`
    );

    // Exact capitalization requested.
    admin.userId = 'Arch-restauranT';

    await admin.save();

    console.log(
      '\n✅ Admin User ID updated successfully!'
    );

    console.log(
      `New Admin User ID: ${admin.userId}`
    );

    console.log(
      `Role: ${admin.role}`
    );

    console.log(
      '\nPassword was NOT changed.'
    );

    console.log(
      '\nYou can now use "Arch-restauranT" for Admin Login.\n'
    );

    await mongoose.disconnect();

  } catch (error) {
    console.error(
      '\n❌ Error updating Admin User ID:',
      error.message
    );

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      // Ignore disconnect errors
    }
  }
};

fixAdminId();