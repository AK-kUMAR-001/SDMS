'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the 'role' column
    await queryInterface.removeColumn('Users', 'role');
  },

  async down(queryInterface, Sequelize) {
    // Re-add the 'role' column
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
