'use strict';
const { Permission, Role, RolePermission } = require('../models/models/index.cjs');

module.exports = {
  async up(queryInterface) {
    // Create permissions
    const permissionsData = [
      { action: 'manage', subject: 'all', description: 'Full access' },
      { action: 'read', subject: 'dashboard', description: 'View dashboard' },
      { action: 'manage', subject: 'users', description: 'Manage users' },
      { action: 'manage', subject: 'roles', description: 'Manage roles' }
    ];
    const permissions = await Permission.bulkCreate(permissionsData, { ignoreDuplicates: true });

    // Create roles
    const [adminRole] = await Role.findOrCreate({
      where: { name: 'Admin' },
      defaults: { description: 'System administrator' }
    });
    const [facultyRole] = await Role.findOrCreate({
      where: { name: 'Faculty' },
      defaults: { description: 'Faculty member' }
    });

    // Associate permissions
    const rolePermissionsData = [
      { roleId: adminRole.id, permissionId: permissions[0].id },
      { roleId: facultyRole.id, permissionId: permissions[1].id }
    ];
    await RolePermission.bulkCreate(rolePermissionsData, { ignoreDuplicates: true });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('RolePermissions', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};