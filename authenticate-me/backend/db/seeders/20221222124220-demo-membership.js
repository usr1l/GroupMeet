'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Memberships'
    await queryInterface.bulkInsert(options, [
      {
        status: 'co-host',
        userId: 1,
        groupId: 1
      },
      {
        status: 'co-host',
        userId: 1,
        groupId: 4
      },
      {
        status: 'co-host',
        userId: 1,
        groupId: 7
      },
      {
        status: 'co-host',
        userId: 1,
        groupId: 10
      },
      {
        status: 'co-host',
        userId: 1,
        groupId: 13
      },
      {
        status: 'co-host',
        userId: 2,
        groupId: 2
      },
      {
        status: 'co-host',
        userId: 2,
        groupId: 5
      },
      {
        status: 'co-host',
        userId: 2,
        groupId: 8
      },
      {
        status: 'co-host',
        userId: 2,
        groupId: 11
      },
      {
        status: 'co-host',
        userId: 3,
        groupId: 3
      },
      {
        status: 'co-host',
        userId: 3,
        groupId: 6
      },
      {
        status: 'co-host',
        userId: 3,
        groupId: 9
      },
      {
        status: 'co-host',
        userId: 3,
        groupId: 12
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const { Op } = require('sequelize');
    return queryInterface.bulkDelete(options);
  }
};
