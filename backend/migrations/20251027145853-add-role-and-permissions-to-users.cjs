'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      'Users',
      'role',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
    await queryInterface.addColumn(
      'Users',
      'permissions',
      {
        type: Sequelize.JSON,
        allowNull: true,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      'Users',
      'role'
    );
    await queryInterface.removeColumn(
      'Users',
      'permissions'
    );
  }
};
