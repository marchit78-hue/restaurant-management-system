const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ================================
// REGISTER CUSTOMER
// ================================
const registerUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      userId,
      password,
    } = req.body;

    if (!name || !phone || !userId || !password) {
      return res.status(400).json({
        message: 'Please fill in all fields',
      });
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanUserId = userId.trim();

    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        message:
          'Phone number must contain exactly 10 digits',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          'Password must contain at least 6 characters',
      });
    }

    // User IDs are treated as case-insensitive.
    const existingUser = await User.findOne({
      $or: [
        {
          phone: cleanPhone,
        },
        {
          userId: {
            $regex: `^${escapeRegex(cleanUserId)}$`,
            $options: 'i',
          },
        },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          'Phone number or User ID already exists',
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name: cleanName,
      phone: cleanPhone,
      userId: cleanUserId,
      password: hashedPassword,
      role: 'customer',
    });

    return res.status(201).json({
      message: 'Account created successfully',
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

    return res.status(500).json({
      message:
        'Server error during registration',
    });
  }
};


// ================================
// LOGIN
// ================================
const loginUser = async (req, res) => {
  try {
    const {
      loginId,
      password,
      role,
    } = req.body;

    if (!loginId || !password || !role) {
      return res.status(400).json({
        message:
          'Please enter login ID, password and role',
      });
    }

    const cleanLoginId = loginId.trim();

    let user = null;

    // --------------------------------
    // PHONE LOGIN
    // --------------------------------
    if (/^\d{10}$/.test(cleanLoginId)) {
      user = await User.findOne({
        phone: cleanLoginId,
      });
    }

    // --------------------------------
    // USER ID LOGIN
    // Case-insensitive permanently
    // --------------------------------
    if (!user) {
      user = await User.findOne({
        userId: {
          $regex: `^${escapeRegex(cleanLoginId)}$`,
          $options: 'i',
        },
      });
    }

    // --------------------------------
    // INVALID USER
    // --------------------------------
    if (!user) {
      return res.status(401).json({
        message:
          'Invalid login credentials',
      });
    }

    // --------------------------------
    // ROLE PROTECTION
    // --------------------------------
    if (user.role !== role) {
      return res.status(403).json({
        message:
          `This account is registered as ${user.role}`,
      });
    }

    // --------------------------------
    // PASSWORD CHECK
    // --------------------------------
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

    // --------------------------------
    // JWT SECURITY CHECK
    // --------------------------------
    if (!process.env.JWT_SECRET) {
      console.error(
        'JWT_SECRET is not configured.'
      );

      return res.status(500).json({
        message:
          'Server authentication is not configured.',
      });
    }

    // --------------------------------
    // CREATE TOKEN
    // --------------------------------
    const token = jwt.sign(
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

    return res.status(200).json({
      message: 'Login successful',

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

    return res.status(500).json({
      message:
        'Server error during login',
    });
  }
};


// ================================
// FORGOT PASSWORD
// ================================
const forgotPassword = async (req, res) => {
  return res.status(503).json({
    message:
      'Password recovery is temporarily unavailable. Please contact the restaurant administrator.',
  });
};


// ================================
// REGEX ESCAPE HELPER
// ================================
function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
}


// ================================
// EXPORTS
// ================================
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
};