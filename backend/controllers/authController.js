const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// =========================
// REGISTER CUSTOMER
// =========================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      userId,
      password,
    } = req.body;

    if (
      !name ||
      !phone ||
      !userId ||
      !password
    ) {
      return res.status(400).json({
        message:
          'Please fill in all fields',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          'Password must contain at least 6 characters',
      });
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanUserId = userId.trim().toLowerCase();

    const existingUser =
      await User.findOne({
        $or: [
          { phone: cleanPhone },
          { userId: cleanUserId },
        ],
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          'Phone number or User ID already exists',
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // IMPORTANT:
    // Public registration can ONLY create
    // customer accounts.
    const user =
      await User.create({
        name: cleanName,
        phone: cleanPhone,
        userId: cleanUserId,
        password: hashedPassword,
        role: 'customer',
      });

    res.status(201).json({
      message:
        'Account created successfully',

      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        userId: user.userId,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      'Register error:',
      error
    );

    res.status(500).json({
      message:
        'Server error during registration',
    });
  }
};

// =========================
// LOGIN
// =========================

const loginUser = async (req, res) => {
  try {
    const {
      loginId,
      password,
      role,
    } = req.body;

    if (
      !loginId ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message:
          'Please enter login ID, password and role',
      });
    }

    const cleanLoginId =
      loginId.trim();

    const user =
      await User.findOne({
        $or: [
          { phone: cleanLoginId },
          {
            userId:
              cleanLoginId.toLowerCase(),
          },
        ],
      });

    if (!user) {
      return res.status(401).json({
        message:
          'Invalid login credentials',
      });
    }

    // The selected role must match
    // the role stored in the database.
    if (user.role !== role) {
      return res.status(403).json({
        message:
          `This account is registered as ${user.role}`,
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          'Invalid login credentials',
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error(
        'JWT_SECRET is not configured.'
      );

      return res.status(500).json({
        message:
          'Server authentication is not configured.',
      });
    }

    const token =
      jwt.sign(
        {
          id: String(user._id),
          role: user.role,
          name: user.name,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d',
        }
      );

    res.json({
      message:
        'Login successful',

      token,

      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        userId: user.userId,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      'Login error:',
      error
    );

    res.status(500).json({
      message:
        'Server error during login',
    });
  }
};

// =========================
// FORGOT PASSWORD
// =========================
//
// NOTE:
// This endpoint is intentionally kept for
// local development for now.
//
// Before public deployment, this must be
// replaced with a verified recovery method
// such as OTP/email verification.
// =========================

const forgotPassword = async (req, res) => {
  try {
    const {
      loginId,
      newPassword,
    } = req.body;

    if (!loginId || !newPassword) {
      return res.status(400).json({
        message:
          'Phone number/User ID and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          'New password must contain at least 6 characters',
      });
    }

    const cleanLoginId =
      loginId.trim();

    const user =
      await User.findOne({
        $or: [
          { phone: cleanLoginId },
          {
            userId:
              cleanLoginId.toLowerCase(),
          },
        ],
      });

    if (!user) {
      return res.status(404).json({
        message:
          'No account found with this phone number or User ID',
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    await user.save();

    res.status(200).json({
      message:
        'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error(
      'Forgot password error:',
      error
    );

    res.status(500).json({
      message:
        'Server error while resetting password',
    });
  }
};

// =========================
// EXPORTS
// =========================

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
};