'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    await queryInterface.addIndex(options, ['userId', 'eventId'], { unique: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    await queryInterface.removeIndex(options, ['userId', 'eventId'])
  }
};
