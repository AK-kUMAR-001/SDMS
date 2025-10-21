const { LeaderboardEntry, User } = require('../models/index.cjs');

module.exports = {
  // Get leaderboard (top N)
  async getLeaderboard(req, res, next) {
    try {
      const top = parseInt(req.query.top) || 10;
      const entries = await LeaderboardEntry.findAll({
        include: [{ model: User }],
        order: [['points', 'DESC']],
        limit: top
      });
      res.json(entries);
    } catch (error) {
      next(error);
    }
  }
};
