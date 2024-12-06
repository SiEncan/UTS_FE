const User = require('../models/User'); // Import model User

// Fungsi untuk mendapatkan profil user
const profilUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Ambil user berdasarkan ID dari token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = undefined; // Jangan kirim password

    res.status(200).json(user); // Mengirimkan data user sebagai response
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user profile', error });
  }
};

// Fungsi untuk update profil user
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validasi input
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const updatedData = { name, email };

    // Update data user di database
    const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;  // Ambil ID user dari token

    // Hapus user dari database
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting account', error });
  }
};

// Fungsi untuk mendapatkan produk yang dibeli oleh user
const getPurchasedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('purchasedProducts.productId'); // Mengambil produk yang dibeli dan populate data produk
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mengambil semua produk yang dibeli oleh user
    const purchasedProducts = user.purchasedProducts.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
      purchasedAt: item.purchasedAt,
      status: item.status
    }));

    res.status(200).json(purchasedProducts);
  } catch (error) {
    console.error('Error fetching purchased products:', error);
    res.status(500).json({ message: 'Error retrieving purchased products', error });
  }
};


module.exports = {
  profilUser,
  updateUserProfile,
  deleteUserProfile,
  getPurchasedProducts
};
