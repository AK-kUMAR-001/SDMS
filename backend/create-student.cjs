const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const config = require('./config/config.json');

const TABLE_NAME = 'Users'; 

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    logging: false
  }
);

async function createStudent() {
  try {
    const hashedPassword = await bcrypt.hash('student123', 10);

    // Find the student role ID
    const studentRole = await sequelize.query(
      'SELECT id FROM "Roles" WHERE name = :roleName',
      {
        replacements: { roleName: 'student' },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!studentRole || studentRole.length === 0) {
      console.error('❌ Error: Student role not found in the database. Please ensure roles are seeded.');
      await sequelize.close();
      return;
    }

    const studentRoleId = studentRole[0].id;
    
    await sequelize.query(
      'INSERT INTO "' + TABLE_NAME + '" (id, name, email, password, "registrationNumber", "isActive", "roleId", permissions, "createdAt", "updatedAt") VALUES (:id, :name, :email, :password, :regNum, :isActive, :roleId, :permissions, NOW(), NOW())',
      {
        replacements: {
          id: uuidv4(),
          name: 'Student User',
          email: 'student@sdms.com',
          password: hashedPassword,
          regNum: 'STUDENT001',
          isActive: true,
          roleId: studentRoleId, // Use the retrieved roleId
          permissions: JSON.stringify(['view:grades', 'view:schedule']) // <-- Student Permissions
        }
      }
    );
    
    console.log('✅ Student user created successfully!');
    console.log('📝 Login credentials:');
    console.log('    Email: student@sdms.com');
    console.log('    Password: student123');
  } catch (error) {
    if (error.message.includes('duplicate key')) {
      console.log('⚠️  Student user already exists!');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await sequelize.close();
  }
}

createStudent();
