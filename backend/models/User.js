// app.factory('UserModel', function () {
//     return {
//         createUser: function (email, password) {
//         return { email: email, password: password };
//     }
// };
// }); 

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin'],
    default: 'user' 
  },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1, min: 1 }
    }
  ],
  purchasedProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },  // Menyimpan jumlah yang dibeli
      priceAtPurchase: { type: Number, required: true }, // Harga saat pembelian
      purchasedAt: { type: Date, default: Date.now },
      status: { type: String, enum: ['pending', 'completed'], default: 'pending' } // Status transaksi
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);