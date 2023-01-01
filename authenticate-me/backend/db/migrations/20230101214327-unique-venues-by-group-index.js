'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Venues'
    await queryInterface.addIndex(options, [
      'address',
      'city',
      'state',
      'lat',
      'lng',
      'groupId'
    ], { unique: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Venues'
    await queryInterface.removeIndex(options, [
      'address',
      'city',
      'state',
      'lat',
      'lng',
      'groupId'
    ])
  }
};
