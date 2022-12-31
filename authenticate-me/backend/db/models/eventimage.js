'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {

    toSafeObject() {
      const { id, url, preview } = this;
      return { id, url, preview }
    };

    static associate(models) {
      // define association here
      EventImage.belongsTo(models.Event, { foreignKey: 'eventId' })
    };
  }
  EventImage.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'EventImage',
    defaultScope: {
      attributes: {
        exclude: ['eventId', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      deletion: {
        attributes: ['id', 'eventId']
      }
    }
  });
  return EventImage;
};
