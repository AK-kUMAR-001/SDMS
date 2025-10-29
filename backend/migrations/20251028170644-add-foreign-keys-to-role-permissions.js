'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('RolePermissions', {
      fields: ['roleId'],
      type: 'foreign key',
      name: 'fk_rolepermissions_roleId',
      references: {
        table: 'Roles',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('RolePermissions', {
      fields: ['permissionId'],
      type: 'foreign key',
      name: 'fk_rolepermissions_permissionId',
      references: {
        table: 'Permissions',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('RolePermissions', 'fk_rolepermissions_roleId');
    await queryInterface.removeConstraint('RolePermissions', 'fk_rolepermissions_permissionId');
  }
};
