const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const dotenv = require("dotenv");

const User = require("./models/User");

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
    await mongoose.connect(process.env.MONGO_URI);

    console.log("\nConnected to MongoDB.\n");

    const name = await question("Admin Name: ");
    const phone = await question("Admin Phone Number: ");
    const userId = await question("Admin User ID: ");
    const password = await question("Admin Password: ");

    if (!name || !phone || !userId || !password) {
      console.log("\n❌ All fields are required.");
      rl.close();
      await mongoose.disconnect();
      return;
    }

    if (password.length < 6) {
      console.log("\n❌ Password must contain at least 6 characters.");
      rl.close();
      await mongoose.disconnect();
      return;
    }

    const existingUser = await User.findOne({
      $or: [
        { phone: phone.trim() },
        { userId: userId.trim().toLowerCase() },
      ],
    });

    if (existingUser) {
      console.log(
        "\n❌ This phone number or User ID is already registered."
      );
      console.log(`Existing account role: ${existingUser.role}`);

      rl.close();
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      userId: userId.trim().toLowerCase(),
      password: hashedPassword,
      role: "admin",
    });

    console.log("\n✅ Admin account created successfully!");
    console.log("--------------------------------");
    console.log(`Name: ${admin.name}`);
    console.log(`Phone: ${admin.phone}`);
    console.log(`User ID: ${admin.userId}`);
    console.log(`Role: ${admin.role}`);
    console.log("--------------------------------");
    console.log("\nYou can now log in as Admin.\n");

    rl.close();
    await mongoose.disconnect();
  } catch (error) {
    console.error("\n❌ Error creating admin:", error.message);

    rl.close();
    await mongoose.disconnect();
  }
};

createAdmin();