const express = require('express');
const router = express.Router();
const leaderboardController = require('../../controllers/controllers/leaderboardController.cjs');
const { authenticateJWT } = require('../../middleware/middleware/authMiddleware.cjs');

// Get all leaderboard entries
router.get('/', authenticateJWT, leaderboardController.getAllLeaderboardEntries);

// Add a new leaderboard entry
router.post('/', authenticateJWT, leaderboardController.addLeaderboardEntry);

module.exports = router;
