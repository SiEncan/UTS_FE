const mongoose = require('mongoose');

// Menghubungkan ke MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://cobauskate:cobauskate@cluster0.vdtdipq.mongodb.net/uSkate?retryWrites=true&w=majority&appName=Cluster0', {
    });
    console.log('MongoDB Connected to Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;