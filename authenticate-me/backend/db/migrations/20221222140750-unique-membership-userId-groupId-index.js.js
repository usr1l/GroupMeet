'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Memberships'
    await queryInterface.addIndex(options, ['userId', 'groupId'], { unique: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Memberships'
    await queryInterface.removeIndex(options, ['userId', 'groupId'])
  }
};
