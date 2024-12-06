const express = require('express');
const {  addReview,  deleteReview, updateReview, addProduct, getAllProducts, getProductByName, getProductById, getRelatedProducts, deleteProduct, updateProduct } = require('../controllers/productController');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/', getAllProducts);

router.get('/find/:id', getProductById);

router.get('/search', getProductByName);

router.post('/add', authenticateUser, addProduct);

router.put('/update/:id', authenticateUser, updateProduct);

router.get('/related', getRelatedProducts);

router.delete('/delete/:id', authenticateUser, deleteProduct);

router.post('/:productId/reviews', authenticateUser, addReview);

router.delete('/:productId/reviews/:reviewId', authenticateUser, deleteReview);

router.put('/:productId/reviews/:reviewId', authenticateUser, updateReview);

module.exports = router;