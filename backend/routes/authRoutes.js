const express = require('express');

const {
  registerUser,
  loginUser,
  forgotPassword,
} = require('../controllers/authController');

const router = express.Router();

// =========================
// PUBLIC AUTHENTICATION
// =========================

// Customer registration
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// =========================
// PASSWORD RECOVERY
// =========================
//
// NOTE:
// The current forgot-password implementation
// is not suitable for public production use
// because it does not verify ownership of the
// phone number/User ID.
//
// We will disable this endpoint before deployment
// and add proper OTP/email recovery later.
//
// =========================

router.post('/forgot-password', (req, res) => {
  return res.status(503).json({
    message:
      'Password recovery is temporarily unavailable. Please contact the restaurant administrator.',
  });
});

module.exports = router;