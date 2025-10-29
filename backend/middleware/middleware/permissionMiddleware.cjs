'use strict';

const authorize = (requiredPermissions) => (req, res, next) => {
  // req.user should be populated by a previous authentication middleware
  if (!req.user || !req.user.permissions) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const userPermissions = req.user.permissions;

  // Check if the user has all the required permissions
  const hasPermission = requiredPermissions.every(requiredPerm => {
    return userPermissions.some(userPerm => {
      // Handle 'manage' and 'all' for comprehensive access
      if (userPerm.action === 'manage' && userPerm.subject === 'all') {
        return true;
      }
      // Check for specific permission match
      return userPerm.action === requiredPerm.action && userPerm.subject === requiredPerm.subject;
    });
  });

  if (hasPermission) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
};

module.exports = { authorize };