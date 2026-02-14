const express = require('express');
const router = express.Router();
const { saveScore, getUserScores } = require('../controllers/scoreController');
const auth = require('../middleware/auth');

// @route   POST /api/scores
// @desc    Save a game score
// @access  Private
router.post('/', auth, saveScore);

// @route   GET /api/scores
// @desc    Get current user's scores
// @access  Private
router.get('/', auth, getUserScores);

module.exports = router;

