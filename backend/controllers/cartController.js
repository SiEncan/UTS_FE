const User = require('../models/User');
const Product = require('../models/Product');

// Add or update product quantity in cart
const addToCart = async (req, res) => {
  const userId = req.user.id;  // Get the logged-in user ID
  const { productId,quantity } = req.body; // Get productId from the request body

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the product is already in the cart
    const productInCart = user.cart.find(item => item.productId.toString() === productId);

    if (productInCart) {
      // If the product exists in the cart, increase the quantity
      productInCart.quantity += quantity;
    } else {
      // If the product doesn't exist in the cart, add it
      user.cart.push({ productId, quantity: quantity });
    }

    await user.save();
    await user.populate('cart.productId');
    res.status(200).json({ message: 'Product added/updated in cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Remove product or decrease quantity
const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the product in the cart
    const productInCart = user.cart.find(item => item.productId.toString() === productId);

    if (!productInCart) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Decrease the quantity
    if (productInCart.quantity > 1) {
      productInCart.quantity -= 1;  // Decrease quantity
    } else {
      // If quantity is 1, remove the product from the cart
      user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    }

    await user.save();
    await user.populate('cart.productId');
    res.status(200).json({ message: 'Product removed/decreased from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk mengambil cart items pengguna
const getCartItems = async (req, res) => {
  const userId = req.user.id;  // ID pengguna yang login

  try {
    const user = await User.findById(userId).populate('cart.productId');  // Populate produk di cart
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ cart: user.cart });  // Kirimkan cart items
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkout = async (req, res) => {
  const userId = req.user.id;

  try {
    // Ambil data user dari database
    const user = await User.findById(userId).populate('cart.productId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Pindahkan item cart ke purchasedProducts
    user.cart.forEach(item => {
      user.purchasedProducts.push({
        productId: item.productId._id,
        quantity: item.quantity,
        priceAtPurchase: item.productId.price,
        status: 'completed'
      });
    });

    // Kosongkan cart setelah pembelian
    user.cart = [];

    await user.save();
    res.status(200).json({ message: 'Checkout successful, items moved to purchased products', cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addToCart, removeFromCart, getCartItems, checkout };