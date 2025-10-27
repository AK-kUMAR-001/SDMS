const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/controllers/analyticsController.cjs');
const { authenticateJWT } = require('../../middleware/middleware/authMiddleware.cjs');

// Get analytics data
router.get('/', authenticateJWT, analyticsController.getAnalytics);

module.exports = router;
