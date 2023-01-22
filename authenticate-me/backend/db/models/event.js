'use strict';

const {
  Model, Validator
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
      Event.hasMany(models.Attendance, { foreignKey: 'eventId', onDelete: 'CASCADE', hooks: true })
      Event.hasMany(models.EventImage, { foreignKey: 'eventId', onDelete: 'CASCADE', hooks: true });
    }
  }
  Event.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        longerThanFiveChars(input) {
          if (input.length < 5) {
            throw new Error('Name must be at least 5 characters');
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
      values: [ 'In person', 'Online' ],
      allowNull: false,
      validate: {
        isIn: {
          args: [ [ 'In person', 'Online' ] ],
          msg: 'Type must be Online or In Person'
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.DECIMAL,
      validate: {
        isNumeric: true,
        greaterThanZero(input) {
          if (input < 0) {
            throw new Error('Price is invalid');
          }
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isProperFormat(input) {
          if (!Validator.isISO8601(input.toISOString())) {
            throw new Error('Date format must be YYYY-MM-DD hh:mm:ss');
          };
        },
        isProperLength(input) {
          const { getDisplayDate } = require('../../utils/helpers');
          const inputISO = getDisplayDate(input);
          if (inputISO.length !== 19) {
            throw new Error('Date format must be YYYY-MM-DD hh:mm:ss');
          };
        },
        checkStartDate(input) {
          if (input < new Date()) {
            throw new Error('Start date must be in the future');
          };
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isProperFormat(input) {
          if (!Validator.isISO8601(input.toISOString())) {
            throw new Error('Date format must be YYYY-MM-DD hh:mm:ss');
          };
        },
        isProperLength(input) {
          const { getDisplayDate } = require('../../utils/helpers');
          const inputISO = getDisplayDate(input);
          if (inputISO.length !== 19) {
            throw new Error('Date format must be YYYY-MM-DD hh:mm:ss');
          };
        },
        checkEndDate(input) {
          if (input < this.startDate) {
            throw new Error('End date is less than start date');
          }
        }
      }
    },
    venueId: {
      type: DataTypes.INTEGER,
      validate: {
        checkForVenue(input) {
          const { Venue } = require('../models');
          const venue = Venue.findByPk(input);
          if (!venue) {
            throw new Error('Venue does not exist');
          }
        }
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    previewImage: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ]
      }
    }
  });
  return Event;
};
