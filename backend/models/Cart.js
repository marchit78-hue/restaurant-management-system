const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
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

const cartSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cart', cartSchema);