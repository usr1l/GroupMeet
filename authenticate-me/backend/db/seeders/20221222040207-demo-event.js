'use strict';

// need this in all seeder and migration files
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Events'
    await queryInterface.bulkInsert(options, [
      {
        name: 'Event1',
        description: '[Event description]',
        type: 'In person',
        capacity: 30,
        price: 50,
        startDate: '2023-10-21 20:00:00',
        endDate: '2023-10-25 20:00:00',
        venueId: 1,
        groupId: 1
      },
      {
        name: 'Event2',
        description: '[Event description]',
        type: 'Online',
        capacity: 40,
        price: null,
        startDate: '2023-01-03 20:00:00',
        endDate: '2023-01-04 20:00:00',
        venueId: 2,
        groupId: 2
      },
      {
        name: 'Event3',
        description: '[Event description]',
        type: 'In person',
        capacity: 30,
        price: 20,
        startDate: '2023-07-08 20:00:00',
        endDate: '2023-09-09 20:00:00',
        venueId: 3,
        groupId: 3
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events';
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Event1', 'Event2', 'Event3'] }
    }, {});
  }
};
