const express = require('express');

const {
  submitFeedback,
  getAllFeedback,
  getMyFeedback,
  getFoodRatings,
} = require('../controllers/feedbackController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');

const router = express.Router();

// ==========================================
// CUSTOMER
// ==========================================

// Submit feedback for own order
router.post(
  '/',
  protect,
  submitFeedback
);

// Get only the logged-in customer's feedback
router.get(
  '/my',
  protect,
  getMyFeedback
);

// ==========================================
// ADMIN ONLY
// ==========================================

// Get all customer reviews
router.get(
  '/',
  protect,
  adminOnly,
  getAllFeedback
);

// Get food-wise rating summary
router.get(
  '/food-ratings',
  protect,
  adminOnly,
  getFoodRatings
);

module.exports = router;