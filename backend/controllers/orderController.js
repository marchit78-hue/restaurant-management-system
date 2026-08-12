const Order = require('../models/Order');

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

const addOrder = async (req, res) => {
  try {
    const { customerName, foodItem, quantity, totalPrice } = req.body;

    if (!customerName || !foodItem || quantity === undefined || totalPrice === undefined) {
      return res.status(400).json({ message: 'Customer Name, Food Item, Quantity, and Total Price are required' });
    }

    const order = await Order.create({
      customerName,
      foodItem,
      quantity: Number(quantity),
      totalPrice: Number(totalPrice),
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ message: 'Failed to add order', error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { customerName, foodItem, quantity, totalPrice } = req.body;

    if (!customerName || !foodItem || quantity === undefined || totalPrice === undefined) {
      return res.status(400).json({ message: 'Customer Name, Food Item, Quantity, and Total Price are required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        foodItem,
        quantity: Number(quantity),
        totalPrice: Number(totalPrice),
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
};

module.exports = { getOrders, addOrder, updateOrder, deleteOrder };
