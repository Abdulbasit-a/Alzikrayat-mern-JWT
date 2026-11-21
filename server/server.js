// Alzikrayat MERN Edition - Express server entry point
// Following patterns taught in Lectures 10-15

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// multer cannot create the destination folder itself
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// API routes (resource-oriented)
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/photos/:id/comments', commentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Alzikrayat API running' });
});

// 404 for unknown routes, then the central error handler (must be last)
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    // Fail fast: without a secret, tokens cannot be signed or verified
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.startsWith('change-me')) {
      throw new Error('JWT_SECRET is missing or still the placeholder. Set a long random value in server/.env');
    }
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alzikrayat');
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Alzikrayat server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Only start listening when run directly (keeps the app importable for tests)
if (require.main === module) start();

module.exports = app;
