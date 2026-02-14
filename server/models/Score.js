const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  level: {
    type: Number,
    required: true,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
scoreSchema.index({ score: -1 });
scoreSchema.index({ user: 1, score: -1 });

module.exports = mongoose.model('Score', scoreSchema);

