const Score = require('../models/Score');

// @route   POST /api/scores
// @desc    Save a game score
// @access  Private
const saveScore = async (req, res) => {
  try {
    const { score, level } = req.body;

    if (score === undefined || level === undefined) {
      return res.status(400).json({ message: 'Score and level are required' });
    }

    const newScore = new Score({
      user: req.user._id,
      score,
      level
    });

    await newScore.save();

    res.status(201).json({
      message: 'Score saved successfully',
      score: {
        id: newScore._id,
        score: newScore.score,
        level: newScore.level,
        createdAt: newScore.createdAt
      }
    });
  } catch (error) {
    console.error('Save score error:', error);
    res.status(500).json({ message: 'Server error saving score' });
  }
};

// @route   GET /api/scores
// @desc    Get current user's scores
// @access  Private
const getUserScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id })
      .sort({ score: -1 })
      .limit(50);

    res.json(scores);
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ message: 'Server error fetching scores' });
  }
};

module.exports = { saveScore, getUserScores };

