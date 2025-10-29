'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /** 
     * Helper method for defining associations. 
     * This method is not a part of Sequelize lifecycle. 
     * The `models/index` file will call this method automatically. 
     */
    static associate(models) {
      // User belongs to a Role 
      User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role'
      });

      // Uncomment these when you have the models 
      // User.hasOne(models.StudentProfile, { foreignKey: 'userId' }); 
      // User.hasMany(models.Certificate, { foreignKey: 'studentId' }); 
      // User.hasMany(models.AuditLog, { foreignKey: 'userId' }); 
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    roleId: {
      type: DataTypes.UUID
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
      unique: true,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
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
    permissions: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // Explicitly set table name 
    timestamps: true
  });

  console.log('✅ User model initialized with correct schema.');
  return User;
};

console.log('📦 User model file loaded.')