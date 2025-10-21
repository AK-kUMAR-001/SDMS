'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LeaderboardEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LeaderboardEntry.belongsTo(models.User, { foreignKey: 'studentId' });
    }
  }
  LeaderboardEntry.init({
    studentId: DataTypes.INTEGER,
    rank: DataTypes.INTEGER,
    points: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LeaderboardEntry',
  });
  return LeaderboardEntry;
};