const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoURL = 'mongodb://localhost:27017'; // MongoDB URL
const dbName = 'uskate_db'; // Nama database
let db;

// Koneksi ke MongoDB
MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  })
  .catch(error => console.error('Connection error:', error));

// Endpoint untuk Sign Up (Membuat Akun Baru)
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Cek apakah user sudah ada
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Tambahkan user ke database dengan inisialisasi lastPage = null
    await db.collection('users').insertOne({ email, password, lastPage: null });
    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Endpoint untuk Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Cari user di database
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cek password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Kirim respons dengan email dan lastPage
    res.status(200).json({
      message: 'Login successful',
      email: user.email,
      lastPage: user.lastPage || null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});


// Endpoint untuk Menyimpan Halaman Terakhir
app.post('/save-last-page', async (req, res) => {
  const { email, lastPage } = req.body;

  try {
    // Validasi input
    if (!email || !lastPage) {
      return res.status(400).json({ message: 'Email and lastPage are required' });
    }

    // Update lastPage user
    await db.collection('users').updateOne(
      { email },
      { $set: { lastPage } }
    );
    res.status(200).json({ message: 'Last page updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Endpoint untuk Mengambil Halaman Terakhir
app.get('/get-last-page/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const user = await db.collection('users').findOne(
      { email },
      { projection: { lastPage: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const lastPage = user.lastPage || 'index.html'; // Default ke halaman beranda
    res.status(200).json({ lastPage });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
