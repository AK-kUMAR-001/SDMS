const express = require('express');
const router = express.Router();
const emailController = require('../../controllers/controllers/emailController.cjs');
const { authenticateJWT } = require('../../middleware/middleware/authMiddleware.cjs');
const { authorize } = require('../../middleware/middleware/permissionMiddleware.cjs');

router.post('/send-test-email', authenticateJWT, authorize(['create'], ['Email']), emailController.sendTestEmail);

module.exports = router;