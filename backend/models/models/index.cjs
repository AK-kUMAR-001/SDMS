'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config/config.cjs');
const db = {};

let sequelize;
try {
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config[env]);
  } else {
    console.log(`Connecting to database: ${config[env].database} on ${config[env].host}:${config[env].port}`);
    sequelize = new Sequelize(
      config[env].database,
      config[env].username,
      config[env].password,
      {
        ...config[env],
        logging: console.log, // Enable SQL logging for debugging
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );
  }
  
  console.log('✅ Sequelize instance created successfully');
} catch (error) {
  console.error('❌ Failed to create Sequelize instance:', error.message);
  throw error;
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    const ext = path.extname(file).toLowerCase();
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (ext === '.js' || ext === '.cjs') &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    console.log(`Loading model from file: ${file}`);
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    console.log(`Associating model: ${modelName}`);
    db[modelName].associate(db);
  }
});

// DEBUG: Log all registered model names
console.log('Registered models:', Object.keys(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
