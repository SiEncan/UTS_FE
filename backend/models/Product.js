const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  color: [{ type: String }],
  price: { type: Number },
  tags: { type: String },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
});

module.exports = mongoose.model('Product', productSchema);