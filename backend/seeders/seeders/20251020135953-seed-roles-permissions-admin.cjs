'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');

    // Seed permissions
    await queryInterface.bulkInsert('Permissions', [
      { id: 1, action: 'manage', subject: 'all', description: 'Full administrative access to the entire system.', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, action: 'manage', subject: 'users', description: 'Create, edit, and delete any user account.', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, action: 'read', subject: 'users', description: 'View lists and profiles of users.', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, action: 'manage', subject: 'certificates', description: 'Approve or reject any submitted certificate.', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, action: 'review', subject: 'certificates', description: 'Review certificates for a specific department.', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, action: 'read', subject: 'certificates', description: 'View all submitted certificates across the system.', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, action: 'upload', subject: 'certificate', description: 'Upload a personal certificate for review.', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, action: 'read', subject: 'leaderboard', description: 'View the student leaderboard.', createdAt: new Date(), updatedAt: new Date() },
      { id: 9, action: 'read', subject: 'dashboard', description: 'View the main dashboard.', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Seed roles
    await queryInterface.bulkInsert('Roles', [
      { id: 1, name: 'Admin', description: 'Has all permissions to manage the system.', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Dean', description: 'Oversees multiple departments and can manage users and certificates.', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'HOD', description: 'Head of Department, manages faculty and reviews student certificates.', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Faculty', description: 'Can view students in their department and review certificates.', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Student', description: 'Can upload certificates and view their status and the leaderboard.', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Seed role-permissions
    await queryInterface.bulkInsert('RolePermissions', [
      { roleId: 1, permissionId: 1, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 2, permissionId: 2, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 2, permissionId: 4, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 2, permissionId: 6, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 2, permissionId: 8, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 2, permissionId: 9, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 3, permissionId: 3, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 3, permissionId: 5, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 3, permissionId: 6, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 3, permissionId: 8, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 3, permissionId: 9, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 4, permissionId: 3, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 4, permissionId: 5, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 4, permissionId: 8, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 4, permissionId: 9, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 5, permissionId: 6, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 5, permissionId: 7, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 5, permissionId: 8, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 5, permissionId: 9, createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Seed admin user
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    await queryInterface.bulkInsert('Users', [
      { email: 'admin@sdms.com', password: hashedPassword, name: 'Admin User', department: 'Administration', status: 'active', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Get admin user id and assign role
    const [users] = await queryInterface.sequelize.query('SELECT id FROM "Users" WHERE email = \'admin@sdms.com\'');
    const adminId = users[0].id;
    await queryInterface.bulkInsert('UserRoles', [
      { userId: adminId, roleId: 1, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserRoles', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('RolePermissions', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};
