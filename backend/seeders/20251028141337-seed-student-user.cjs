'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Get the Student role ID
    const [studentRoles] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE name = 'Student' LIMIT 1;`
    );

    const studentRoleId = studentRoles.length > 0 ? studentRoles[0].id : null;

    if (!studentRoleId) {
      console.log('Student role not found, skipping student user seeding.');
      return;
    }

    // Check if the student user already exists
    const [existingStudentUser] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'student@sdms.com' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    let studentUserId;
    if (existingStudentUser && existingStudentUser.id) {
      console.log('Student user already exists, skipping insertion.');
      studentUserId = existingStudentUser.id;
    } else {
      // Insert student user
      const studentPassword = await bcrypt.hash('student123', 10);
      studentUserId = uuidv4();
      await queryInterface.bulkInsert('Users', [{
        id: studentUserId,
        name: 'Student User',
        email: 'student@sdms.com',
        password: studentPassword,
        registrationNumber: 'STU001',
        isActive: true,
        roleId: studentRoleId,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

      // Create StudentProfile for the new student user
      await queryInterface.bulkInsert('StudentProfiles', [{
        id: uuidv4(),
        userId: studentUserId,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  async down (queryInterface, Sequelize) {
    // Delete the student user and their profile
    await queryInterface.bulkDelete('Users', { email: 'student@sdms.com' }, {});
    // Assuming StudentProfile has a foreign key constraint with cascade delete,
    // deleting the user should also delete the profile.
    // If not, you might need to explicitly delete from StudentProfiles as well.
  }
};
