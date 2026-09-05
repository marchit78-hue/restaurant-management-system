const Order = require('../models/Order');
const Menu = require('../models/Menu');

const normalizeItems = async (body) => {
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return null;
  }

  const normalizedItems = [];

  for (const item of body.items) {
    const quantity = Number(item.quantity);

    if (
      !item.foodItem ||
      !item.sizeCategory ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw new Error(
        'Each order item must include foodItem, sizeCategory and a valid quantity'
      );
    }

    const menuItem = await Menu.findOne({
      foodName: item.foodItem.trim(),
    });

    if (!menuItem) {
      throw new Error(`Menu item "${item.foodItem}" was not found`);
    }

    if (!menuItem.isAvailable) {
      throw new Error(`"${menuItem.foodName}" is currently unavailable`);
    }

    const sizeCategory = item.sizeCategory.trim().toLowerCase();

    let unitPrice;

    if (sizeCategory === 'half') {
      unitPrice = Number(menuItem.halfPrice);
    } else if (sizeCategory === 'full') {
      unitPrice = Number(menuItem.fullPrice);
    } else {
      throw new Error(
        `Invalid size category for "${menuItem.foodName}"`
      );
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error(
        `Invalid price configured for "${menuItem.foodName}"`
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

const calculateTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
  };
};

// GET ORDERS
const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'admin') {
      orders = await Order.find().sort({
        createdAt: -1,
      });
    } else {
      orders = await Order.find({
        customerId: req.user.id,
      }).sort({
        createdAt: -1,
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);

    res.status(500).json({
      message: 'Failed to fetch orders',
    });
  }
};

// ADD ORDER
const addOrder = async (req, res) => {
  try {
    // Never trust customer identity from the browser.
    const customerId = req.user.id;

    const customerName = req.user.name || req.body.customerName;

    if (!customerName) {
      return res.status(400).json({
        message: 'Customer name is required',
      });
    }

    const items = await normalizeItems(req.body);

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: 'At least one food item is required',
      });
    }

    const totals = calculateTotals(items);

    const order = await Order.create({
      customerName: customerName.trim(),
      customerId,
      items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      grandTotal: totals.grandTotal,
      status: 'Pending',
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Error adding order:', error);

    res.status(400).json({
      message: error.message || 'Failed to place order',
    });
  }
};

// UPDATE ORDER
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    const items = await normalizeItems(req.body);

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: 'At least one food item is required',
      });
    }

    const totals = calculateTotals(items);

    const updatedOrder =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          items,
          subtotal: totals.subtotal,
          tax: totals.tax,
          grandTotal: totals.grandTotal,
          status:
            req.body.status ||
            order.status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);

    res.status(400).json({
      message: error.message || 'Failed to update order',
    });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const order =
      await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    res.status(200).json({
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order:', error);

    res.status(500).json({
      message: 'Failed to delete order',
    });
  }
};

module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
};