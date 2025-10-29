'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('userroles', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_userroles_userId',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('userroles', {
      fields: ['roleId'],
      type: 'foreign key',
      name: 'fk_userroles_roleId',
      references: {
        table: 'Roles',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('userroles', 'fk_userroles_userId');
    await queryInterface.removeConstraint('userroles', 'fk_userroles_roleId');
  }
};
