'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AuditLog.init({
    timestamp: DataTypes.DATE,
    actorId: DataTypes.INTEGER,
    actorName: DataTypes.STRING,
    action: DataTypes.STRING,
    targetType: DataTypes.STRING,
    targetId: DataTypes.INTEGER,
    details: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'AuditLog',
  });
  return AuditLog;
};