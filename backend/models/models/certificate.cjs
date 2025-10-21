'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Certificate.belongsTo(models.User, { foreignKey: 'studentId' });
    }
  }
  Certificate.init({
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    studentId: DataTypes.INTEGER,
    fileUrl: DataTypes.STRING,
    issuedBy: DataTypes.STRING,
    issuedDate: DataTypes.DATE,
    status: DataTypes.STRING,
    points: DataTypes.INTEGER,
    reviewedBy: DataTypes.STRING,
    rejectionReason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Certificate',
  });
  return Certificate;
};