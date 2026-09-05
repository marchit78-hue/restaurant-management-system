const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    foodItem: {
      type: String,
      required: true,
      trim: true,
    },

    sizeCategory: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerId: {
      type: String,
      default: '',
      trim: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: 'Order must contain at least one item',
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    tax: {
      type: Number,
      required: true,
      min: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Preparing',
        'Ready',
        'Completed',
        'Cancelled',
      ],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);