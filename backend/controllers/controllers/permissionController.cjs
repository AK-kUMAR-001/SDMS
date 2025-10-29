'use strict';
const { Permission } = require('../../models/models/index.cjs');

// Create a new permission
exports.createPermission = async (req, res) => {
  try {
    const { action, subject, description } = req.body;
    const permission = await Permission.create({ action, subject, description });
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single permission by ID
exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (permission) {
      res.status(200).json(permission);
    } else {
      res.status(404).json({ error: 'Permission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a permission by ID
exports.updatePermission = async (req, res) => {
  try {
    const { action, subject, description } = req.body;
    const permission = await Permission.findByPk(req.params.id);

    if (permission) {
      await permission.update({ action, subject, description });
      res.status(200).json(permission);
    } else {
      res.status(404).json({ error: 'Permission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a permission by ID
exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (permission) {
      await permission.destroy();
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: 'Permission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};