'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.User, { foreignKey: 'userId' });
      Attendance.belongsTo(models.Event, { foreignKey: 'eventId' });
    }
  }
  Attendance.init({
    status: {
      type: DataTypes.ENUM,
      values: ['member', 'pending', 'waitlist', 'attending'],
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
