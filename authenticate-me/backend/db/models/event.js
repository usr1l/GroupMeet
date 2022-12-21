'use strict';
const { Venue } = require('../models')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Group, { foreignKey: 'groupId' });
      Event.belongsTo(models.Venue, { foreignKey: 'venueId' });
      Event.belongsToMany(models.User,
        {
          through: models.Attendance,
          foreignKey: 'eventId',
          otherKey: 'userId'
        });
      Event.hasMany(models.EventImage, { foreignKey: 'eventId' });
      Event.hasMany(models.Attendence, { foreignKey: 'eventId' });
    }
  }
  Event.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        longerThanFiveChars(input) {
          if (input.length < 5) {
            throw new Error('Name must be at least 5 characters')
          }
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      validate: {
        isIn: {
          args: [['In person', 'Online']],
          msg: 'Type must be Online or In Person'
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        greaterThanZero(input) {
          if (input < 0) {
            throw new Error('Price is invalid')
          }
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: {
          args: new Date(),
          msg: 'Start date must be in the future'
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: {
          args: this.startDate,
          msg: 'End date is less than start date'
        }
      }
    },
    venueId: {
      type: DataTypes.INTEGER,
      validate: {
        checkForVenue(input) {
          const venue = Venue.findByPk(input);
          if (!venue) {
            throw new Error('Venue does not exist')
          }
        }
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
