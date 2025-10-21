const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Get all users
router.get('/', authenticateJWT, userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Create user
router.post('/', userController.createUser);

// Update user
router.put('/:id', userController.updateUser);

// Deactivate user
router.patch('/:id/deactivate', userController.deactivateUser);

module.exports = router;
