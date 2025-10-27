const express = require('express');
const router = express.Router();
const userController = require('../../controllers/controllers/userController.cjs');
const { authenticateJWT } = require('../../middleware/middleware/authMiddleware.cjs');

// Get all users
router.get('/', authenticateJWT, userController.getAllUsers);

// Get user by ID
router.get('/:id', authenticateJWT, userController.getUserById);

// Update user by ID
router.put('/:id', authenticateJWT, userController.updateUserById);

// Delete user by ID
router.delete('/:id', authenticateJWT, userController.deleteUserById);

module.exports = router;
