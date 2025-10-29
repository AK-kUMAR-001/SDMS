const express = require('express');
const router = express.Router();
const certificateController = require('../../controllers/controllers/certificateController.cjs');
const { authenticateJWT, authorize } = require('../../middleware/middleware/authMiddleware.cjs');

// Get all certificates
router.get('/', authenticateJWT, authorize(['read'], ['Certificate']), certificateController.getAllCertificates);

// Get certificate by ID
router.get('/:id', authenticateJWT, authorize(['read'], ['Certificate']), certificateController.getCertificateById);

// Create a new certificate
router.post('/', authenticateJWT, authorize(['create'], ['Certificate']), certificateController.createCertificate);

// Update certificate by ID
router.put('/:id', authenticateJWT, authorize(['update'], ['Certificate']), certificateController.updateCertificateById);

// Delete certificate by ID
router.delete('/:id', authenticateJWT, authorize(['delete'], ['Certificate']), certificateController.deleteCertificateById);

module.exports = router;
