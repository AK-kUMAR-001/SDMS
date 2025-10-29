'use strict'; 
 
 /** @type {import('sequelize-cli').Migration} */ 
 module.exports = { 
   async up(queryInterface, Sequelize) { 
     await queryInterface.createTable('Roles', { // Must be plural! 
       id: { 
         allowNull: false, 
         primaryKey: true, 
         type: Sequelize.UUID, 
         defaultValue: Sequelize.UUIDV4 
       }, 
       name: { 
         type: Sequelize.STRING, 
         allowNull: false, 
         unique: true 
       }, 
       description: { 
         type: Sequelize.TEXT, 
         allowNull: true 
       }, 
       createdAt: { 
         allowNull: false, 
         type: Sequelize.DATE, 
         defaultValue: Sequelize.NOW 
       }, 
       updatedAt: { 
         allowNull: false, 
         type: Sequelize.DATE, 
         defaultValue: Sequelize.NOW 
       } 
     }); 
 
     // Add index 
     await queryInterface.addIndex('Roles', ['name'], { 
       name: 'roles_name_unique', 
       unique: true 
     }); 
   }, 
 
   async down(queryInterface, Sequelize) { 
     await queryInterface.dropTable('Roles'); 
   } 
 };