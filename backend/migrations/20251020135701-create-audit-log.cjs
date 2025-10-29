'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auditlogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      timestamp: {
        type: Sequelize.DATE
      },
      actorId: {
        type: Sequelize.INTEGER
      },
      actorName: {
        type: Sequelize.STRING
      },
      action: {
        type: Sequelize.STRING
      },
      targetType: {
        type: Sequelize.STRING
      },
      targetId: {
        type: Sequelize.INTEGER
      },
      details: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('auditLogs');
  }
};