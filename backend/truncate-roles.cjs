'use strict';

const { Sequelize } = require('sequelize');
const config = require('./config/config.json').development;

async function truncateRoles() {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.query('TRUNCATE TABLE "Roles" RESTART IDENTITY CASCADE;');
    console.log('Roles table truncated successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or truncate table:', error);
  } finally {
    await sequelize.close();
  }
}

truncateRoles();