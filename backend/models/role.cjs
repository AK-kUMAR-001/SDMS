'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Role has many Users
      Role.hasMany(models.User, {
        foreignKey: 'roleId',
        as: 'users'
      });
      
      // Role has many Permissions (through RolePermissions)
      if (models.Permission && models.RolePermission) {
        Role.belongsToMany(models.Permission, {
          through: models.RolePermission,
          foreignKey: 'roleId',
          otherKey: 'permissionId',
          as: 'permissions'
        });
      }
    }
  }
  
  Role.init({
    id: {
      type: DataTypes.UUID,  // ✅ Changed from INTEGER to UUID
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'Roles',
    timestamps: true
  });
  
  console.log('✅ Role model initialized.');
  return Role;
};

console.log('📦 Role model file loaded.');