const Menu = require('../models/Menu');

// =========================
// GET ALL MENU ITEMS
// =========================

const getMenu = async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({
      createdAt: -1,
    });

    res.status(200).json(menuItems);
  } catch (error) {
    console.error(
      'Error fetching menu:',
      error
    );

    res.status(500).json({
      message: 'Failed to fetch menu items',
      error: error.message,
    });
  }
};


// =========================
// ADD MENU ITEM
// =========================

const addMenu = async (req, res) => {
  try {
    const {
      foodName,
      halfPrice,
      fullPrice,
      image,
      isAvailable,
    } = req.body;

    if (
      !foodName ||
      halfPrice === undefined ||
      halfPrice === null ||
      fullPrice === undefined ||
      fullPrice === null
    ) {
      return res.status(400).json({
        message:
          'Food Name, Half Price, and Full Price are required',
      });
    }

    const half = Number(halfPrice);
    const full = Number(fullPrice);

    if (
      !Number.isFinite(half) ||
      half < 0
    ) {
      return res.status(400).json({
        message:
          'Half Price must be a valid number',
      });
    }

    if (
      !Number.isFinite(full) ||
      full < 0
    ) {
      return res.status(400).json({
        message:
          'Full Price must be a valid number',
      });
    }

    const menuItem = await Menu.create({
      foodName: foodName.trim(),

      halfPrice: half,

      fullPrice: full,

      image: image
        ? image.trim()
        : '',

      isAvailable:
        typeof isAvailable === 'boolean'
          ? isAvailable
          : true,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error(
      'Error adding menu item:',
      error
    );

    res.status(500).json({
      message:
        'Failed to add menu item',
      error: error.message,
    });
  }
};


// =========================
// UPDATE MENU ITEM
// =========================

const updateMenu = async (req, res) => {
  try {
    const {
      foodName,
      halfPrice,
      fullPrice,
      image,
      isAvailable,
    } = req.body;

    if (
      !foodName ||
      halfPrice === undefined ||
      halfPrice === null ||
      fullPrice === undefined ||
      fullPrice === null
    ) {
      return res.status(400).json({
        message:
          'Food Name, Half Price, and Full Price are required',
      });
    }

    const half = Number(halfPrice);
    const full = Number(fullPrice);

    if (
      !Number.isFinite(half) ||
      half < 0
    ) {
      return res.status(400).json({
        message:
          'Half Price must be a valid number',
      });
    }

    if (
      !Number.isFinite(full) ||
      full < 0
    ) {
      return res.status(400).json({
        message:
          'Full Price must be a valid number',
      });
    }

    const updateData = {
      foodName: foodName.trim(),

      halfPrice: half,

      fullPrice: full,

      image: image
        ? image.trim()
        : '',
    };

    // Only update availability when
    // it is explicitly provided.
    if (
      typeof isAvailable === 'boolean'
    ) {
      updateData.isAvailable =
        isAvailable;
    }

    const menuItem =
      await Menu.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!menuItem) {
      return res.status(404).json({
        message:
          'Menu item not found',
      });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    console.error(
      'Error updating menu item:',
      error
    );

    res.status(500).json({
      message:
        'Failed to update menu item',
      error: error.message,
    });
  }
};


// =========================
// DELETE MENU ITEM
// =========================

const deleteMenu = async (req, res) => {
  try {
    const menuItem =
      await Menu.findByIdAndDelete(
        req.params.id
      );

    if (!menuItem) {
      return res.status(404).json({
        message:
          'Menu item not found',
      });
    }

    res.status(200).json({
      message:
        'Menu item deleted successfully',
    });
  } catch (error) {
    console.error(
      'Error deleting menu item:',
      error
    );

    res.status(500).json({
      message:
        'Failed to delete menu item',
      error: error.message,
    });
  }
};


// =========================
// TOGGLE AVAILABILITY
// =========================

const toggleAvailability = async (
  req,
  res
) => {
  try {
    const menuItem =
      await Menu.findById(
        req.params.id
      );

    if (!menuItem) {
      return res.status(404).json({
        message:
          'Menu item not found',
      });
    }

    menuItem.isAvailable =
      !menuItem.isAvailable;

    await menuItem.save();

    res.status(200).json({
      message: menuItem.isAvailable
        ? 'Item is now available'
        : 'Item is now unavailable',

      menuItem,
    });
  } catch (error) {
    console.error(
      'Error changing availability:',
      error
    );

    res.status(500).json({
      message:
        'Failed to update item availability',
      error: error.message,
    });
  }
};


module.exports = {
  getMenu,
  addMenu,
  updateMenu,
  deleteMenu,
  toggleAvailability,
};