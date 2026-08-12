const Menu = require('../models/Menu');

const getMenu = async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Failed to fetch menu items', error: error.message });
  }
};

const addMenu = async (req, res) => {
  try {
    const { foodName, sizeCategory, price } = req.body;

    if (!foodName || !sizeCategory || price === undefined || price === null) {
      return res.status(400).json({ message: 'Food Name, Size Category, and Price are required' });
    }

    const menuItem = await Menu.create({ foodName, sizeCategory, price: Number(price) });
    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Failed to add menu item', error: error.message });
  }
};

const updateMenu = async (req, res) => {
  try {
    const { foodName, sizeCategory, price } = req.body;

    if (!foodName || !sizeCategory || price === undefined || price === null) {
      return res.status(400).json({ message: 'Food Name, Size Category, and Price are required' });
    }

    const menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      { foodName, sizeCategory, price: Number(price) },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Failed to update menu item', error: error.message });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Failed to delete menu item', error: error.message });
  }
};

module.exports = { getMenu, addMenu, updateMenu, deleteMenu };
