const { User, Role } = require('../models/index.cjs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  // Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email }, include: [Role] });
      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user.id, roles: user.Roles.map(r => r.name) }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      next(error);
    }
  },

  // Logout (client-side token removal)
  logout(req, res) {
    res.json({ message: 'Logged out' });
  },

  // Refresh token (simplified)
  refresh(req, res) {
    const { token } = req.body;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const newToken = jwt.sign({ userId: decoded.userId, roles: decoded.roles }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token: newToken });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
};
