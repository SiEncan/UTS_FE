const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email mengandung @admin.com
    const role = email.includes('@admin.com') ? 'admin' : 'user';  // Tentukan role berdasarkan email

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru dengan role yang sudah ditentukan
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role  // Menyimpan role yang telah ditentukan
    });

    // Simpan user ke database
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};