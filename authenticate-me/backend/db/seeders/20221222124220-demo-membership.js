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
        userId: 2,
        groupId: 2
      },
      {
        status: 'co-host',
        userId: 3,
        groupId: 3
      },
      {
        status: 'member',
        userId: 1,
        groupId: 2
      },
      {
        status: 'member',
        userId: 1,
        groupId: 3
      },
      {
        status: 'member',
        userId: 2,
        groupId: 1
      },
      {
        status: 'member',
        userId: 2,
        groupId: 3
      },
      {
        status: 'member',
        userId: 3,
        groupId: 2
      },
      {
        status: 'pending',
        userId: 3,
        groupId: 1
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, [
      { id: { [Op.in]: [1, 2, 3, 4] } }
    ])
  }
};
