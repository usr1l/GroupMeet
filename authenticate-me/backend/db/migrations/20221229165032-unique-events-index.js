'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Events'
    await queryInterface.addIndex(options, [
      'name',
      'description',
      'type',
      'capacity',
      'price',
      'startDate',
      'endDate',
      'groupId'
      // 'venueId',
    ], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events'
    await queryInterface.removeIndex(options, [
      'name',
      'description',
      'type',
      'capacity',
      'price',
      'startDate',
      'endDate',
      'groupId'
      // 'venueId',
    ]);
  }
};
