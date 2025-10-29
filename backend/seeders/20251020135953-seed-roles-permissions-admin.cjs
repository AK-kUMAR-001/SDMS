'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');
    const { v4: uuidv4 } = require('uuid');

    // Seed permissions
    await queryInterface.bulkInsert('Permissions', [
      { id: uuidv4(), action: 'manage', subject: 'all', description: 'Full administrative access to the entire system.', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), action: 'manage', subject: 'users', description: 'Create, edit, and delete any user account.', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), action: 'read', subject: 'users', description: 'View lists and profiles of users.', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), action: 'manage', subject: 'certificates', description: 'Approve or reject any submitted certificate.', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), action: 'review', subject: 'certificates', description: 'Review certificates for a specific department.', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), action: 'read', subject: 'certificates', description: 'View all submitted certificates across the system.', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), action: 'upload', subject: 'certificate', description: 'Upload a personal certificate for review.', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), action: 'read', subject: 'leaderboard', description: 'View the student leaderboard.', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), action: 'read', subject: 'dashboard', description: 'View the main dashboard.', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Seed roles
     let adminRoleId;
     let deanRoleId;
     let hodRoleId;
     let facultyRoleId;
     let studentRoleId;
     // Check if Admin role already exists before inserting
     const [existingAdminRole] = await queryInterface.sequelize.query(
       'SELECT id FROM \"Roles\" WHERE name = \'Admin\' LIMIT 1;',
       { type: Sequelize.QueryTypes.SELECT }
     );

     if (existingAdminRole) {
       console.log('Admin role already exists, skipping insertion.');
       // If it exists, we need to retrieve its ID to use for UserRoles
       adminRoleId = existingAdminRole.id;
     } else {
       adminRoleId = uuidv4();
       await queryInterface.bulkInsert('Roles', [
         { id: adminRoleId, name: 'Admin', description: 'Has all permissions to manage the system.', createdAt: new Date(), updatedAt: new Date() },
       ], {});
     }

     // Check if Dean role already exists before inserting
     const [existingDeanRole] = await queryInterface.sequelize.query(
       'SELECT id FROM \"Roles\" WHERE name = \'Dean\' LIMIT 1;',
       { type: Sequelize.QueryTypes.SELECT }
     );

     if (existingDeanRole) {
       console.log('Dean role already exists, skipping insertion.');
       deanRoleId = existingDeanRole.id;
     } else {
       deanRoleId = uuidv4();
       await queryInterface.bulkInsert('Roles', [
         { id: deanRoleId, name: 'Dean', description: 'Oversees multiple departments and can manage users and certificates.', createdAt: new Date(), updatedAt: new Date() },
       ], {});
     }

     // Check if HOD role already exists before inserting
     const [existingHodRole] = await queryInterface.sequelize.query(
       'SELECT id FROM \"Roles\" WHERE name = \'HOD\' LIMIT 1;',
       { type: Sequelize.QueryTypes.SELECT }
     );

     if (existingHodRole) {
       console.log('HOD role already exists, skipping insertion.');
       hodRoleId = existingHodRole.id;
     } else {
       hodRoleId = uuidv4();
       await queryInterface.bulkInsert('Roles', [
         { id: hodRoleId, name: 'HOD', description: 'Head of Department, manages faculty and reviews student certificates.', createdAt: new Date(), updatedAt: new Date() },
       ], {});
     }

     // Check if Faculty role already exists before inserting
     const [existingFacultyRole] = await queryInterface.sequelize.query(
       'SELECT id FROM \"Roles\" WHERE name = \'Faculty\' LIMIT 1;',
       { type: Sequelize.QueryTypes.SELECT }
     );

     if (existingFacultyRole) {
       console.log('Faculty role already exists, skipping insertion.');
       facultyRoleId = existingFacultyRole.id;
     } else {
       facultyRoleId = uuidv4();
       await queryInterface.bulkInsert('Roles', [
         { id: facultyRoleId, name: 'Faculty', description: 'Can view students in their department and review certificates.', createdAt: new Date(), updatedAt: new Date() },
       ], {});
     }

     // Check if Student role already exists before inserting
     const [existingStudentRole] = await queryInterface.sequelize.query(
       'SELECT id FROM \"Roles\" WHERE name = \'Student\' LIMIT 1;',
       { type: Sequelize.QueryTypes.SELECT }
     );

     if (existingStudentRole) {
       console.log('Student role already exists, skipping insertion.');
       studentRoleId = existingStudentRole.id;
     } else {
       studentRoleId = uuidv4();
       await queryInterface.bulkInsert('Roles', [
         { id: studentRoleId, name: 'Student', description: 'Can upload certificates and view their status and the leaderboard.', createdAt: new Date(), updatedAt: new Date() },
       ], {});
     }

     // Seed role-permissions
    const permissions = await queryInterface.sequelize.query('SELECT id, action, subject FROM "Permissions"', { type: Sequelize.QueryTypes.SELECT });

    const getPermissionId = (action, subject) => permissions.find(p => p.action === action && p.subject === subject)?.id;

    await queryInterface.bulkInsert('RolePermissions', [
      { id: uuidv4(), roleId: adminRoleId, permissionId: getPermissionId('manage', 'all'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: deanRoleId, permissionId: getPermissionId('manage', 'users'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: deanRoleId, permissionId: getPermissionId('manage', 'certificates'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: deanRoleId, permissionId: getPermissionId('read', 'certificates'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: deanRoleId, permissionId: getPermissionId('read', 'leaderboard'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: deanRoleId, permissionId: getPermissionId('read', 'dashboard'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: hodRoleId, permissionId: getPermissionId('read', 'users'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: hodRoleId, permissionId: getPermissionId('review', 'certificates'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: hodRoleId, permissionId: getPermissionId('read', 'certificates'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: hodRoleId, permissionId: getPermissionId('read', 'leaderboard'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: hodRoleId, permissionId: getPermissionId('read', 'dashboard'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: facultyRoleId, permissionId: getPermissionId('read', 'users'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: facultyRoleId, permissionId: getPermissionId('review', 'certificates'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: facultyRoleId, permissionId: getPermissionId('read', 'leaderboard'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: facultyRoleId, permissionId: getPermissionId('read', 'dashboard'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: studentRoleId, permissionId: getPermissionId('read', 'certificates'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: studentRoleId, permissionId: getPermissionId('upload', 'certificate'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: studentRoleId, permissionId: getPermissionId('read', 'leaderboard'), createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), roleId: studentRoleId, permissionId: getPermissionId('read', 'dashboard'), createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Seed admin user
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    let adminUserId;

    const [existingAdminUser] = await queryInterface.sequelize.query(
      'SELECT id FROM \"Users\" WHERE email = \'admin@sdms.com\' LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingAdminUser) {
      console.log('Admin user already exists, skipping insertion.');
      adminUserId = existingAdminUser.id;
    } else {
      adminUserId = uuidv4();
      await queryInterface.bulkInsert('Users', [
        { id: adminUserId, email: 'admin@sdms.com', password: hashedPassword, name: 'Admin User', createdAt: new Date(), updatedAt: new Date() },
      ], {});
    }

    // Assign admin role to admin user
     await queryInterface.bulkInsert('userroles', [
       { id: uuidv4(), userId: adminUserId, roleId: adminRoleId, createdAt: new Date(), updatedAt: new Date() },
     ], {});
   },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('userroles', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('RolePermissions', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};
