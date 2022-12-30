'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Groups'
    await queryInterface.addIndex(options, [
      'name',
      'about',
      'type',
      'private',
      'city',
      'state',
      'organizerId'
    ], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups'
    await queryInterface.removeIndex(options, [
      'name',
      'about',
      'type',
      'private',
      'city',
      'state',
      'organizerId'
    ]);
  }
};
