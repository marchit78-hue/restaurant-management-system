const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error('Not allowed by CORS')
      );
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// Connect to MongoDB before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(
      'Database connection error:',
      error.message
    );

    res.status(500).json({
      message:
        'Database connection failed. Please try again later.',
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/feedback', feedbackRoutes);

// API health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'arch-restaurant API is running',
  });
});

// Local development only
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `arch-restaurant API running on port ${PORT}`
    );
  });
}

module.exports = app;
