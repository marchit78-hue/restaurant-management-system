const express = require('express');

const {
  getMenu,
  addMenu,
  updateMenu,
  deleteMenu,
  toggleAvailability,
} = require('../controllers/menuController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// --------------------------------------------------
// CUSTOMER + ADMIN
// Anyone can view the menu.
// --------------------------------------------------

router.get('/', getMenu);

// --------------------------------------------------
// ADMIN ONLY
// Menu management requires a valid admin JWT.
// --------------------------------------------------

router.post('/', protect, adminOnly, addMenu);

router.put('/:id', protect, adminOnly, updateMenu);

router.delete('/:id', protect, adminOnly, deleteMenu);

router.patch(
  '/:id/availability',
  protect,
  adminOnly,
  toggleAvailability
);

module.exports = router;