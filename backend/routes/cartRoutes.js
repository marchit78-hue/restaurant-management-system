const express = require('express');

const {
  saveCart,
  getMyCart,
  getAllCarts,
  clearCart,
} = require('../controllers/cartController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');

const router = express.Router();

// Customer
router.post('/', protect, saveCart);
router.get('/my', protect, getMyCart);
router.delete('/', protect, clearCart);

// Admin
router.get('/all', protect, adminOnly, getAllCarts);

module.exports = router;