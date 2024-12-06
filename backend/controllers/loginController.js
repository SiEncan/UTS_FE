const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' }); // Ubah 404 menjadi 401
    }

    // Cek apakah password cocok
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' }); // Sudah benar 401 untuk password salah
    }

    // Buat token dengan payload termasuk id, name, dan role
    const token = jwt.sign(
      { 
        id: user._id, 
        name: user.name, 
        role: user.role // Menambahkan role ke dalam payload token
      }, 
      'secretkey', 
      { expiresIn: '1h' }
    );

    // Kirim token dan userId ke frontend
    res.status(200).json({ token, userId: user._id });  // Kirim userId selain token
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};