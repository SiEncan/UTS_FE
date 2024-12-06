const express = require('express');
const connectDB = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const app = express();
const port = 3009;
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));