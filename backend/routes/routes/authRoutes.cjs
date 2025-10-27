const express = require('express');
const router = express.Router();
const authController = require('../../controllers/controllers/authController.cjs');
const { authenticateJWT } = require('../../middleware/middleware/authMiddleware.cjs');

// Register a new user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

// Get current user profile
router.get('/profile', authenticateJWT, authController.getProfile);

// Update user profile
router.put('/profile', authenticateJWT, authController.updateProfile);

module.exports = router;
