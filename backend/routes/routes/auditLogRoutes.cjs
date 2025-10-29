const express = require('express');
const router = express.Router();
const auditLogController = require('../../controllers/controllers/auditLogController.cjs');
const { authenticateJWT, authorize } = require('../../middleware/middleware/authMiddleware.cjs');

// Get all audit logs
router.get('/', authenticateJWT, authorize(['read'], ['AuditLog']), auditLogController.getAllAuditLogs);

module.exports = router;
