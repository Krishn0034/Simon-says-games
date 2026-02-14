require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/scores');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Simon Says API is running' });
});

// Connect to MongoDB and start server
const PORT = 5002;
let mongoServer;

const startServer = async () => {
  try {
    // Start MongoDB Memory Server with download options
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.4',
        skipMD5: true
      }
    });
    
    const MONGODB_URI = mongoServer.getUri();
    console.log('📦 MongoDB Memory Server URI:', MONGODB_URI);
    
    // Connect with longer timeout
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000
    });
    console.log('✅ Connected to MongoDB Memory Server');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Server starting without database - some features may be limited');
  } finally {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }
};

startServer();

module.exports = app;

