const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Get leaderboard (top N)
router.get('/', authenticateJWT, leaderboardController.getLeaderboard);

module.exports = router;
