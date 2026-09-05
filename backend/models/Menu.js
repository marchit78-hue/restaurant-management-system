const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      required: true,
      trim: true,
    },

    halfPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    fullPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: '',
      trim: true,
    },

    // =========================
    // ITEM AVAILABILITY
    // =========================

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'Menu',
  menuSchema
);