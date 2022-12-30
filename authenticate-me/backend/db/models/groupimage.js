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

    static associate(models) {
      GroupImage.belongsTo(models.Group, { foreignKey: 'groupId' })
    }
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
        exclude: ['createdAt', 'updatedAt', 'groupId']
      }
    }
  });
  return GroupImage;
};
