const Score = require('../models/Score');
const User = require('../models/User');

// @route   GET /api/leaderboard
// @desc    Get top 10 scores (ascending order)
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    // Get top 10 scores sorted in ascending order (lowest score wins - like a golf game)
    // Or descending if you want highest scores to win
    // Based on requirements: "Top 10 scores sorted in ascending order"
    const topScores = await Score.find()
      .sort({ score: 1 }) // Ascending order
      .limit(10)
      .populate('user', 'username')
      .lean();

    // Format the response
    const leaderboard = topScores.map((entry, index) => ({
      rank: index + 1,
      username: entry.user?.username || 'Anonymous',
      score: entry.score,
      level: entry.level,
      createdAt: entry.createdAt
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
};

module.exports = { getLeaderboard };

