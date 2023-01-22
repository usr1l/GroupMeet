'use strict';
// const { Membership } = require('../models')
const { Op } = require('sequelize')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {

    static associate(models) {
      Group.hasMany(models.Venue, { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true })
      Group.belongsTo(models.User, { foreignKey: 'organizerId' });
      Group.hasMany(models.Event, { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true })
      Group.hasMany(models.GroupImage, { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true })
      Group.hasMany(models.Membership, { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true })
    }
  }
  Group.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [ 0, 60 ]
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        longerThanFiftyChars(input) {
          if (input.length < 50) {
            throw new Error('About must be 50 characters or more')
          }
        }
      }
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
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    previewImage: {
      type: DataTypes.STRING
    },
    organizerId: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Group',
    defaultScope: {
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ]
      }
    },
    scopes: {
      allDetails: { exclude: [] }
    }
  });
  return Group;
};
