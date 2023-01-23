'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Venues';
    await queryInterface.bulkInsert(options, [
      {
        address: '135 Demo St.',
        city: 'Manhattan',
        state: 'NY',
        lat: 120,
        lng: -120,
        groupId: 1,
      },
      {
        address: '155 Demo St.',
        city: 'Brooklyn',
        state: 'NY',
        lat: 130,
        lng: -130,
        groupId: 2,
      },
      {
        address: '175 Demo St.',
        city: 'Long Island',
        state: 'NY',
        lat: 140,
        lng: -140,
        groupId: 3,
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options);
  }
};
