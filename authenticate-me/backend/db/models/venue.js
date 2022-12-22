'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.belongsTo(models.Group, { foreignKey: 'groupId' })
    }
  }
  Venue.init({
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true,
        max: 180,
        mid: -180
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true,
        max: 180,
        min: -180
      }
    },
    groupId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
