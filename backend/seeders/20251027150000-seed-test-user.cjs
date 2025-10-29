'use strict'; 
 const bcrypt = require('bcrypt'); 
 const { v4: uuidv4 } = require('uuid'); 
 
 /** @type {import('sequelize-cli').Migration} */ 
 module.exports = { 
   async up(queryInterface, Sequelize) { 
     // First, get the admin role ID 
     const [roles] = await queryInterface.sequelize.query( 
       `SELECT id FROM "Roles" WHERE name = 'admin' LIMIT 1;` 
     ); 
 
     const adminRoleId = roles.length > 0 ? roles[0].id : null; 
 
     // Hash password 
     const hashedPassword = await bcrypt.hash('admin123', 10); 
 
     // Insert admin user 
     await queryInterface.bulkInsert('Users', [{  // Capital U to match your migrations 
       id: uuidv4(), 
       name: 'Admin User', 
       email: 'admin@sdms.com', 
       password: hashedPassword, 
       registrationNumber: 'ADMIN001', 
       isActive: true, 
       roleId: adminRoleId, 
       createdAt: new Date(), 
       updatedAt: new Date() 
     }]); 
 
     // Insert test user 
     const testPassword = await bcrypt.hash('password123', 10); 
     await queryInterface.bulkInsert('Users', [{ 
       id: uuidv4(), 
       name: 'Test User', 
       email: 'test@example.com', 
       password: testPassword, 
       registrationNumber: 'TEST001', 
       isActive: true, 
       roleId: adminRoleId, 
       createdAt: new Date(), 
       updatedAt: new Date() 
     }]); 
   }, 
 
   async down(queryInterface, Sequelize) { 
     await queryInterface.bulkDelete('Users', { 
       email: ['admin@sdms.com', 'test@example.com'] 
     }, {}); 
   } 
 };