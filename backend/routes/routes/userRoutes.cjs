const express = require('express');
const router = express.Router();
const userController = require('../../controllers/controllers/userController.cjs');
const { authenticateJWT } = require('../../middleware/middleware/authMiddleware.cjs');
const { authorize } = require('../../middleware/middleware/permissionMiddleware.cjs');
const upload = require('../../middleware/middleware/uploadMiddleware.cjs');

// Get all users
router.get('/', authenticateJWT, authorize([{ action: 'read', subject: 'User' }]), userController.getAllUsers);

// Get user by ID
router.get('/:id', authenticateJWT, authorize([{ action: 'read', subject: 'User' }]), userController.getUserById);

// Upload profile picture
router.post('/:id/uploadProfilePicture', authenticateJWT, upload.single('profilePicture'), authorize([{ action: 'update', subject: 'User' }]), userController.uploadProfilePicture);

// Update user by ID
router.put('/:id', authenticateJWT, authorize([{ action: 'update', subject: 'User' }]), userController.updateUserById);

// Delete user by ID
router.delete('/:id', authenticateJWT, authorize([{ action: 'delete', subject: 'User' }]), userController.deleteUserById);

module.exports = router;
