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

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// --------------------------------------------------
// BODY PARSER
// --------------------------------------------------

app.use(express.json({ limit: '1mb' }));

// --------------------------------------------------
// ROUTES
// --------------------------------------------------

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/feedback', feedbackRoutes);

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'arch-restaurant API is running',
  });
});

// --------------------------------------------------
// DATABASE
// --------------------------------------------------

connectDB();

// --------------------------------------------------
// LOCAL SERVER
// --------------------------------------------------

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `arch-restaurant API running on port ${PORT}`
    );
  });
}

// --------------------------------------------------
// VERCEL
// --------------------------------------------------

module.exports = app;
