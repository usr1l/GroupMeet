'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    await queryInterface.bulkInsert(options, [
      {
        status: 'member',
        eventId: 1,
        userId: 1
      },
      {
        status: 'pending',
        eventId: 2,
        userId: 1
      },
      {
        status: 'member',
        eventId: 3,
        userId: 1
      },
      {
        status: 'attending',
        eventId: 1,
        userId: 2
      },
      {
        status: 'pending',
        eventId: 2,
        userId: 2
      },
      {
        status: 'member',
        eventId: 3,
        userId: 2
      },
      {
        status: 'attending',
        eventId: 1,
        userId: 3
      },
      {
        status: 'member',
        eventId: 2,
        userId: 3
      },
      {
        status: 'pending',
        eventId: 3,
        userId: 3
      },
      {
        status: 'member',
        eventId: 4,
        userId: 1
      },
      {
        status: 'member',
        eventId: 5,
        userId: 2
      },
      {
        status: 'member',
        eventId: 6,
        userId: 3
      },
      {
        status: 'member',
        eventId: 7,
        userId: 1
      },
      {
        status: 'member',
        eventId: 8,
        userId: 2
      },
      {
        status: 'member',
        eventId: 9,
        userId: 3
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const { Op } = require('sequelize');
    return queryInterface.bulkDelete(options);
  }
};
