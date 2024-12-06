const mongoose = require('mongoose');
const Product = require('../models/Product');

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const { title, image, description, color, price, tags } = req.body;
    
    // Create a new product instance
    const product = new Product({
      title,
      image, // Fixed the typo, using 'image' instead of 'photo'
      description,
      color, // The array of colors
      price, // Array of prices, assuming there can be multiple price options
      tags,
    });

    // Save the product to the database
    await product.save();

    // Return a success message along with the created product
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
    try {
      const { tag } = req.query; // Mendapatkan query parameter 'tag' jika ada
      let products;
  
      if (tag) {
        // Jika ada query tag, filter berdasarkan tag tersebut
        products = await Product.find({ tags: tag }).populate('createdBy', 'name');
      } else {
       
        products = await Product.find().populate('createdBy', 'name');
      }
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


exports.getProductByName = async (req, res) => {
  const { name } = req.query; 
  
  if (!name) {
    return res.status(400).json({ message: 'Product name query parameter is required' });
  }

  try {
    const products = await Product.find({
      title: { $regex: name, $options: 'i' }  // 'i' untuk case-insensitive
    });

    if (products.length === 0) {
      return res.status(200).json({ message: 'No products found', data: [] });
    }

    // Mengembalikan hasil pencarian
    res.status(200).json({ message: 'Products found', data: products });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getProductById = async (req, res) => {
  const { id } = req.params;

  // Validasi format ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid product ID format' });
  }

  try {
    // Populate reviews.userId dengan data name dari User
    const product = await Product.findById(id).populate('reviews.userId');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product); // Mengembalikan produk beserta reviews yang sudah dipopulate
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all unique tags
exports.getAllProducts = async (req, res) => {
  try {
      const { tag } = req.query; // Mendapatkan query parameter 'tag' jika ada
      let products;

      if (tag) {
          // Jika ada query tag, filter berdasarkan tag tersebut
          products = await Product.find({ tags: tag });
      } else {
          products = await Product.find();
      }

      res.status(200).json(products);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


exports.getRelatedProducts = async (req, res) => {
  const { productId } = req.query;
  try {
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Mengambil produk dengan tag yang sama sebagai produk terkait
      const relatedProducts = await Product.find({ tags: { $in: product.tags } }).limit(10);
      res.status(200).json(relatedProducts);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Controller untuk menghapus produk
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;  // Mengambil ID produk dari parameter URL

    // Memeriksa apakah ID produk valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID format' });
    }

    try {
        // Mencari dan menghapus produk berdasarkan ID
        const product = await Product.findByIdAndDelete(id);

        // Memeriksa apakah produk ditemukan
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Mengirim respons sukses
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const updatedData = req.body; // Data yang dikirimkan dalam request body

  Product.findByIdAndUpdate(productId, updatedData, { new: true, runValidators: true })
    .then(updatedProduct => {
      if (!updatedProduct) {
        return res.status(404).send({ message: 'Product not found' });
      }
      res.status(200).send(updatedProduct); // Mengirimkan produk yang telah diperbarui
    })
    .catch(error => {
      console.error('Error updating product:', error);
      res.status(500).send({ message: 'Failed to update product', error });
    });
};

exports.addReview = async (req, res) => {
  const { productId } = req.params;  // Ambil productId dari URL
  const { userId, rating, comment } = req.body;  // Ambil data review dari body request

  // Validasi apakah productId valid
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid product ID format' });
  }

  try {
    // Cari produk berdasarkan productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Membuat review baru
    const newReview = {
      userId,
      rating,
      comment,
      timestamp: new Date()
    };

    // Menambahkan review ke dalam array reviews produk
    product.reviews.push(newReview);

    // Simpan perubahan pada produk
    await product.save();

    // Kirim response dengan data review yang baru ditambahkan
    res.status(201).json({ message: 'Review added successfully', newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};


exports.deleteReview = async (req, res) => {
  const { productId, reviewId } = req.params;

  try {
    // Cari produk berdasarkan productId
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Cari review berdasarkan reviewId
    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Menggunakan pull untuk menghapus review dari array
    product.reviews.pull({ _id: reviewId });

    // Simpan perubahan pada produk
    await product.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  const { productId, reviewId } = req.params;
  const { comment, rating } = req.body;  // Ambil data komentar dan rating dari body request

  try {
    // Cari produk berdasarkan productId
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Cari review berdasarkan reviewId
    const review = product.reviews.id(reviewId);  // Menggunakan `id` untuk mencari review di dalam array `reviews`
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update komentar dan rating review
    review.comment = comment;
    review.rating = rating;

    // Simpan perubahan pada produk
    await product.save();

    res.status(200).json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};