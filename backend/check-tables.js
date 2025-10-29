const { Sequelize } = require('sequelize');
const config = require('./config/config.json');

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

async function checkTables() {
  try {
    const [results] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    );
    console.log('\n📋 Tables in database:');
    results.forEach(row => console.log('  ✓ ' + row.table_name));
    
    // Check case sensitivity
    console.log('\n🔍 Checking table name case:');
    try {
      await sequelize.query('SELECT 1 FROM "Users" LIMIT 1');
      console.log('  ✓ "Users" (capital U) exists');
    } catch (e) {
      console.log('  ✗ "Users" does NOT exist');
    }
    
    try {
      await sequelize.query('SELECT 1 FROM users LIMIT 1');
      console.log('  ✓ "users" (lowercase) exists');
    } catch (e) {
      console.log('  ✗ "users" does NOT exist');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkTables();
