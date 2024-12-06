const express = require('express');
const register = require('../controllers/registerController');
const login = require('../controllers/loginController');
const { profilUser, updateUserProfile, deleteUserProfile, getPurchasedProducts } = require('../controllers/profileController');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();

// Register user
router.post('/register', register.registerUser);

// Login user
router.post('/login', login.loginUser);

// Profil user (dapat diakses dengan autentikasi)
router.get('/profile', authenticateUser, profilUser);

// Update profil user (hanya dapat diakses jika sudah login)
router.put('/profile', authenticateUser, updateUserProfile);

router.delete('/profile/delete', authenticateUser, deleteUserProfile);

router.get('/purchased-products', authenticateUser, getPurchasedProducts);

module.exports = router;