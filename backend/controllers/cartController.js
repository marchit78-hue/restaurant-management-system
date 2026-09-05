const Cart = require('../models/Cart');
const Menu = require('../models/Menu');

const buildCartItems = async (items) => {
  if (!Array.isArray(items)) {
    throw new Error('Cart items must be an array.');
  }

  const normalizedItems = [];

  for (const item of items) {
    const quantity = Number(item.quantity);

    if (
      !item.foodItem ||
      !item.sizeCategory ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw new Error(
        'Each cart item must include foodItem, sizeCategory and a valid quantity.'
      );
    }

    const menuItem = await Menu.findOne({
      foodName: item.foodItem.trim(),
    });

    if (!menuItem) {
      throw new Error(`Menu item "${item.foodItem}" was not found.`);
    }

    if (!menuItem.isAvailable) {
      throw new Error(`"${menuItem.foodName}" is currently unavailable.`);
    }

    const sizeCategory = item.sizeCategory.trim().toLowerCase();

    let unitPrice;

    if (sizeCategory === 'half') {
      unitPrice = Number(menuItem.halfPrice);
    } else if (sizeCategory === 'full') {
      unitPrice = Number(menuItem.fullPrice);
    } else {
      throw new Error(
        `Invalid size category for "${menuItem.foodName}".`
      );
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error(
        `Invalid price configured for "${menuItem.foodName}".`
      );
    }

    normalizedItems.push({
      foodItem: menuItem.foodName,
      sizeCategory:
        sizeCategory.charAt(0).toUpperCase() +
        sizeCategory.slice(1),
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice,
    });
  }

  return normalizedItems;
};

// ==================== SAVE CUSTOMER CART ====================

const saveCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Please login before saving your cart.',
      });
    }

    const customerName = req.user.name || req.body.customerName;

    if (!customerName) {
      return res.status(400).json({
        message: 'Customer name is required.',
      });
    }

    const normalizedItems = await buildCartItems(req.body.items);

    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const cart = await Cart.findOneAndUpdate(
      {
        customerId: req.user.id,
      },
      {
        customerId: req.user.id,
        customerName: customerName.trim(),
        items: normalizedItems,
        subtotal: Number(subtotal.toFixed(2)),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: 'Cart saved successfully.',
      cart,
    });
  } catch (error) {
    console.error('Error saving cart:', error);

    res.status(400).json({
      message: error.message || 'Failed to save cart.',
    });
  }
};

// ==================== GET CUSTOMER CART ====================

const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      customerId: req.user.id,
    });

    if (!cart) {
      return res.status(200).json({
        customerId: req.user.id,
        items: [],
        subtotal: 0,
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);

    res.status(500).json({
      message: 'Failed to fetch cart.',
    });
  }
};

// ==================== GET ALL LIVE CARTS ====================

const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find({
      items: {
        $exists: true,
        $not: {
          $size: 0,
        },
      },
    }).sort({
      updatedAt: -1,
    });

    res.status(200).json(carts);
  } catch (error) {
    console.error('Error fetching live carts:', error);

    res.status(500).json({
      message: 'Failed to fetch live cart demand.',
    });
  }
};

// ==================== CLEAR CART ====================

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      {
        customerId: req.user.id,
      },
      {
        items: [],
        subtotal: 0,
      }
    );

    res.status(200).json({
      message: 'Cart cleared successfully.',
    });
  } catch (error) {
    console.error('Error clearing cart:', error);

    res.status(500).json({
      message: 'Failed to clear cart.',
    });
  }
};

module.exports = {
  saveCart,
  getMyCart,
  getAllCarts,
  clearCart,
};