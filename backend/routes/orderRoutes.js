const express = require('express');

const {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');

const router = express.Router();

// Customer + Admin
router.post('/', protect, addOrder);

// Customer + Admin can view orders
router.get('/', protect, getOrders);

// Admin only
router.put('/:id', protect, adminOnly, updateOrder);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;