'use strict';
const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/controllers/roleController.cjs');
const { authenticateJWT } = require('../../middleware/middleware/authMiddleware.cjs');
const { authorize } = require('../../middleware/middleware/permissionMiddleware.cjs');

// Create a new role (Admin only)
router.post('/', authenticateJWT, authorize(['manage'], ['roles']), roleController.createRole);

// Get all roles (Admin only)
router.get('/', authenticateJWT, authorize(['read'], ['roles']), roleController.getAllRoles);

// Get a single role by ID (Admin only)
router.get('/:id', authenticateJWT, authorize(['read'], ['roles']), roleController.getRoleById);

// Update a role by ID (Admin only)
router.put('/:id', authenticateJWT, authorize(['manage'], ['roles']), roleController.updateRole);

// Delete a role by ID (Admin only)
router.delete('/:id', authenticateJWT, authorize(['manage'], ['roles']), roleController.deleteRole);

module.exports = router;