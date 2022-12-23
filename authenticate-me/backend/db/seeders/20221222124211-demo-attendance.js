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
        status: 'waitlist',
        eventId: 3,
        userId: 2
      },
      {
        status: 'co-host',
        eventId: 1,
        userId: 1
      },
      {
        status: 'co-host',
        eventId: 2,
        userId: 3
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, [
      { id: { [Op.in]: [1, 2, 3] } }
    ])
  }
};
