'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Certificates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      studentId: {
        type: Sequelize.INTEGER
      },
      fileUrl: {
        type: Sequelize.STRING
      },
      issuedBy: {
        type: Sequelize.STRING
      },
      issuedDate: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      points: {
        type: Sequelize.INTEGER
      },
      reviewedBy: {
        type: Sequelize.STRING
      },
      rejectionReason: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Certificates');
  }
};