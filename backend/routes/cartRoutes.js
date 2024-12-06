const express = require('express');
const { addToCart, removeFromCart, getCartItems, checkout } = require('../controllers/cartController');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/items', authenticateUser, getCartItems);

router.post('/add', authenticateUser, addToCart);

router.post('/remove', authenticateUser, removeFromCart);

router.post('/checkout', authenticateUser, checkout);

module.exports = router;