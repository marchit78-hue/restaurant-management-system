const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  sizeCategory: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Menu', menuSchema);
