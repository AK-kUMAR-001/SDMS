'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserRole.belongsTo(models.User, { foreignKey: 'userId' });
      UserRole.belongsTo(models.Role, { foreignKey: 'roleId' });
    }
  }
  UserRole.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID
    },
    roleId: {
      type: DataTypes.UUID
    }
  }, {
    sequelize,
    modelName: 'UserRole',
  });
  return UserRole;
};