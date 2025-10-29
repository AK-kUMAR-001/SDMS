'use strict'; 
 const bcrypt = require('bcrypt'); 
 const { v4: uuidv4 } = require('uuid'); 
 
 /** @type {import('sequelize-cli').Migration} */ 
 module.exports = { 
   async up(queryInterface, Sequelize) { 
     // First, get the admin role ID 
     const [roles] = await queryInterface.sequelize.query( 
       `SELECT id FROM "Roles" WHERE name = 'Admin' LIMIT 1;` 
     ); 
 
     const adminRoleId = roles.length > 0 ? roles[0].id : null; 
 
     if (!adminRoleId) { 
       console.log('Admin role not found, skipping test user seeding.'); 
       return; 
     } 
 
     const bcrypt = require('bcrypt'); 
     const { v4: uuidv4 } = require('uuid'); 
 
     // Check if the test user already exists 
     const [existingTestUser] = await queryInterface.sequelize.query( 
       `SELECT id FROM "Users" WHERE email = 'test@example.com' LIMIT 1;`, 
       { type: Sequelize.QueryTypes.SELECT } 
     ); 
 
     let testUserId; 
     if (existingTestUser && existingTestUser.id) { 
       console.log('Test user already exists, skipping insertion.'); 
       testUserId = existingTestUser.id; 
     } else { 
       // Insert test user 
       const testPassword = await bcrypt.hash('password123', 10); 
       testUserId = uuidv4(); 
       await queryInterface.bulkInsert('Users', [{ 
         id: testUserId, 
         name: 'Test User', 
         email: 'test@example.com', 
         password: testPassword, 
         registrationNumber: 'TEST001', 
         isActive: true, 
         roleId: adminRoleId, 
         createdAt: new Date(), 
         updatedAt: new Date() 
       }]); 
     } 
 
     // Get faculty role ID 
     const [facultyRoles] = await queryInterface.sequelize.query( 
       `SELECT id FROM "Roles" WHERE name = 'Faculty' LIMIT 1;` 
     ); 
     const facultyRoleId = facultyRoles.length > 0 ? facultyRoles[0].id : null; 
 
     if (!facultyRoleId) { 
       console.log('Faculty role not found, skipping faculty user seeding.'); 
     } else { 
       // Check if the faculty user already exists 
       const [existingFacultyUser] = await queryInterface.sequelize.query( 
         `SELECT id FROM "Users" WHERE email = 'faculty@sdms.com' LIMIT 1;`, 
         { type: Sequelize.QueryTypes.SELECT } 
       ); 
 
       let facultyUserId; 
       if (existingFacultyUser && existingFacultyUser.id) { 
         console.log('Faculty user already exists, skipping insertion.'); 
         facultyUserId = existingFacultyUser.id; 
       } else { 
         // Insert faculty user 
         const facultyPassword = await bcrypt.hash('faculty123', 10); 
         facultyUserId = uuidv4(); 
         await queryInterface.bulkInsert('Users', [{ 
           id: facultyUserId, 
           name: 'Faculty Member', 
           email: 'faculty@sdms.com', 
           password: facultyPassword, 
           registrationNumber: 'FAC001', 
           isActive: true, 
           roleId: facultyRoleId, 
           createdAt: new Date(), 
           updatedAt: new Date() 
         }]); 
       } 
     } 
   }, 
 
   async down(queryInterface, Sequelize) { 
     await queryInterface.bulkDelete('Users', { 
       email: ['test@example.com', 'faculty@sdms.com'] 
     }, {}); 
   } 
 };