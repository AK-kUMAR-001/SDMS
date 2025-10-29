'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StudentProfile.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  StudentProfile.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    points: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StudentProfile',
    tableName: 'StudentProfiles',
    timestamps: true
  });
  return StudentProfile;
};