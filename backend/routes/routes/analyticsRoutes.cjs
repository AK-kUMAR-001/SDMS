const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/controllers/analyticsController.cjs');
const { authenticateJWT, authorize } = require('../../middleware/middleware/authMiddleware.cjs');

// Get analytics data
router.get('/', authenticateJWT, authorize(['read'], ['Analytics']), analyticsController.getAnalytics);

module.exports = router;
