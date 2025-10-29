const express = require('express');
const router = express.Router();
const leaderboardController = require('../../controllers/controllers/leaderboardController.cjs');
const { authenticateJWT, authorize } = require('../../middleware/middleware/authMiddleware.cjs');

// Get all leaderboard entries
router.get('/', authenticateJWT, authorize(['read'], ['Leaderboard']), leaderboardController.getAllLeaderboardEntries);

// Add a new leaderboard entry
router.post('/', authenticateJWT, authorize(['create'], ['Leaderboard']), leaderboardController.addLeaderboardEntry);

module.exports = router;
