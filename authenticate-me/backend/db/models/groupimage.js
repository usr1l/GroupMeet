'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {

    toSafeObject() {
      const { id, url, preview } = this;
      return { id, url, preview }
    };
    3
    static associate(models) {
      GroupImage.belongsTo(models.Group, { foreignKey: 'groupId' })
    };
  }
  GroupImage.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'GroupImage',
    defaultScope: {
      attributes: {
        exclude: [ 'updatedAt' ]
      }
    },
    scopes: {
      deletion: {
        attributes: [ 'groupId', 'id' ]
      }
    }
  });
  return GroupImage;
};
