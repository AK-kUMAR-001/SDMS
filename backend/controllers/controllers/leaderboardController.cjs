const { LeaderboardEntry } = require('../../models/models/leaderboardentry.cjs');
const { User } = require('../../models/models/user.cjs');

// Get all leaderboard entries
exports.getAllLeaderboardEntries = async (req, res) => {
  try {
    const leaderboardEntries = await LeaderboardEntry.findAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['score', 'DESC']],
    });
    res.status(200).json(leaderboardEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new leaderboard entry
exports.addLeaderboardEntry = async (req, res) => {
  try {
    const { userId, score } = req.body;
    const newEntry = await LeaderboardEntry.create({ userId, score });
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
