const express = require('express');
const router = express.Router();
const certificateController = require('../../controllers/controllers/certificateController.cjs');
const { authenticateJWT } = require('../../middleware/middleware/authMiddleware.cjs');

// Get all certificates
router.get('/', authenticateJWT, certificateController.getAllCertificates);

// Get certificate by ID
router.get('/:id', authenticateJWT, certificateController.getCertificateById);

// Create a new certificate
router.post('/', authenticateJWT, certificateController.createCertificate);

// Update certificate by ID
router.put('/:id', authenticateJWT, certificateController.updateCertificateById);

// Delete certificate by ID
router.delete('/:id', authenticateJWT, certificateController.deleteCertificateById);

module.exports = router;
