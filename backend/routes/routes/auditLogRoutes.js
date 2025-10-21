const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');

// Get audit logs (paginated)
router.get('/', auditLogController.getAuditLogs);

module.exports = router;
