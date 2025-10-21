const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Get certificate activity summary
router.get('/certificates', authenticateJWT, analyticsController.getCertificateAnalytics);

module.exports = router;
