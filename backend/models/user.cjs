'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User belongs to a Role
      if (models.Role) {
        User.belongsTo(models.Role, {
          foreignKey: 'roleId',
          as: 'roleDetails'
        });
      }
    }
  }
  
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true
      // Note: This is redundant with roleId, but exists in DB
    },
    permissions: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
  });
  
  console.log('✅ User model initialized.');
  return User;
};

console.log('📦 User model file loaded.');