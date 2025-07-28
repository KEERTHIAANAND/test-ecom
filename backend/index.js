require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Import models
const User = require('./models/User');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = user; // Attach user info to request
    next();
  });
}

// User signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ name, lastname, email, password });
    await user.save();
    // Generate JWT token
    const token = jwt.sign({ id: user._id, name: user.name, lastname: user.lastname, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered successfully', user: { id: user._id, name: user.name, lastname: user.lastname, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Create a new order (protected)
app.post('/api/order', authenticateToken, async (req, res) => {
  try {
    const { items, total, address, customerName, customerPhone } = req.body;
    if (!customerName || !customerPhone) {
      return res.status(400).json({ message: 'Customer name and phone are required.' });
    }
    const order = new Order({
      userId: req.user.id,
      customerName,
      customerPhone,
      items,
      total,
      address
    });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message });
  }
});

// User login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Compare password (plain text for now)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id, name: user.name, lastname: user.lastname, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Example protected route
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    // req.user contains the decoded JWT payload
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// Protected route: Get user's orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    // Only return orders for the logged-in user
    const orders = await Order.find({ userId: req.user.id });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

// Get a single order by ID (protected)
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
});

// Get user's cart (protected)
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
});

// Create or update user's cart (protected)
app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = items;
      cart.updatedAt = Date.now();
      await cart.save();
    } else {
      cart = new Cart({ userId: req.user.id, items });
      await cart.save();
    }
    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart', error: err.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 