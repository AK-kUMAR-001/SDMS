const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

// Get all certificates
router.get('/', certificateController.getAllCertificates);
// Get certificates by student ID
router.get('/student/:studentId', certificateController.getCertificatesByStudentId);
// Create certificate
router.post('/', certificateController.createCertificate);
// Update certificate status
router.patch('/:id/status', certificateController.updateCertificateStatus);

module.exports = router;
