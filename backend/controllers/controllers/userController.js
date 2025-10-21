const { User, Role, AuditLog } = require('../models/index.cjs');
const bcrypt = require('bcrypt');

module.exports = {
  // Get all users
  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({ include: [Role] });
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id, { include: [Role] });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      next(error);
    }
  },

  // Create user
  async createUser(req, res, next) {
    try {
      const { email, password, name, department, roleId } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        department,
        status: 'active'
      });
      if (roleId) {
        await user.addRole(roleId);
      }
      await AuditLog.create({
        timestamp: new Date(),
        actorId: req.user ? req.user.userId : null,
        actorName: req.user ? req.user.userId : 'system',
        action: 'USER_CREATED',
        targetType: 'user',
        targetId: user.id,
        details: JSON.stringify({ email, name, department, roleId })
      });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  // Update user
  async updateUser(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        await user.update(req.body);
        await AuditLog.create({
          timestamp: new Date(),
          actorId: req.user ? req.user.userId : null,
          actorName: req.user ? req.user.userId : 'system',
          action: 'USER_UPDATED',
          targetType: 'user',
          targetId: user.id,
          details: JSON.stringify(req.body)
        });
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      next(error);
    }
  },

  // Deactivate user
  async deactivateUser(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        await user.update({ status: 'inactive' });
        await AuditLog.create({
          timestamp: new Date(),
          actorId: req.user ? req.user.userId : null,
          actorName: req.user ? req.user.userId : 'system',
          action: 'USER_DEACTIVATED',
          targetType: 'user',
          targetId: user.id,
          details: JSON.stringify({ status: 'inactive' })
        });
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      next(error);
    }
  }
};
