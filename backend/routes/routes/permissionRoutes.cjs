'use strict';
const express = require('express');
const router = express.Router();
const permissionController = require('../../controllers/controllers/permissionController.cjs');
const { authenticateJWT } = require('../../middleware/middleware/authMiddleware.cjs');
const { authorize } = require('../../middleware/middleware/permissionMiddleware.cjs');

// Create a new permission (Admin only)
router.post('/', authenticateJWT, authorize(['manage'], ['permissions']), permissionController.createPermission);

// Get all permissions (Admin only)
router.get('/', authenticateJWT, authorize(['read'], ['permissions']), permissionController.getAllPermissions);

// Get a single permission by ID (Admin only)
router.get('/:id', authenticateJWT, authorize(['read'], ['permissions']), permissionController.getPermissionById);

// Update a permission by ID (Admin only)
router.put('/:id', authenticateJWT, authorize(['manage'], ['permissions']), permissionController.updatePermission);

// Delete a permission by ID (Admin only)
router.delete('/:id', authenticateJWT, authorize(['manage'], ['permissions']), permissionController.deletePermission);

module.exports = router;