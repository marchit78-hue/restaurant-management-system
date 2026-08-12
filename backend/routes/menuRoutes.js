const express = require('express');
const { getMenu, addMenu, updateMenu, deleteMenu } = require('../controllers/menuController');

const router = express.Router();

router.get('/', getMenu);
router.post('/', addMenu);
router.put('/:id', updateMenu);
router.delete('/:id', deleteMenu);

module.exports = router;
