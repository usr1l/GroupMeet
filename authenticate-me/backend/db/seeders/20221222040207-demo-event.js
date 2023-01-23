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
      { name: 'Summer Concert Series', description: 'Annual concert series featuring local musicians', type: 'In person', capacity: 500, price: 0, startDate: '2022-07-01 19:00:00', endDate: '2022-07-01 22:00:00', venueId: 1, groupId: 1 },
      { name: 'Book Club Meeting', description: 'Monthly meeting to discuss the latest book selection', type: 'Online', capacity: null, price: null, startDate: '2022-08-15 18:00:00', endDate: '2022-08-15 19:30:00', venueId: null, groupId: 2 },
      { name: 'Networking Event', description: 'Opportunity for professionals to connect and network', type: 'In person', capacity: 200, price: 20, startDate: '2022-09-20 17:00:00', endDate: '2022-09-20 20:00:00', venueId: 2, groupId: 3 },
      { name: 'Yoga in the Park', description: 'Outdoor yoga class open to all skill levels', type: 'In person', capacity: 100, price: 10, startDate: '2022-10-10 09:00:00', endDate: '2022-10-10 10:30:00', venueId: 1, groupId: 4 },
      { name: 'Tech Workshop', description: 'Workshop to learn about the latest technology trends', type: 'Online', capacity: null, price: null, startDate: '2022-11-01 19:00:00', endDate: '2022-11-01 21:00:00', venueId: null, groupId: 5 },
      { name: 'Art Show', description: 'Local artists showcase their work', type: 'In person', capacity: 50, price: 0, startDate: '2022-12-05 14:00:00', endDate: '2022-12-05 17:00:00', venueId: 2, groupId: 6 },
      { name: 'Dinner Party', description: 'Private dinner party for friends and family', type: 'In person', capacity: 12, price: null, startDate: '2023-01-15 19:00:00', endDate: '2023-01-15 22:00:00', venueId: 1, groupId: 7 },
      { name: 'Trivia Night', description: 'Weekly trivia competition with prizes', type: 'In person', capacity: 100, price: 0, startDate: '2023-02-01 19:00:00', endDate: '2023-02-01 21:00:00', venueId: 2, groupId: 8 },
      { name: 'Gardening Class', description: 'Learn how to grow your own vegetables and herbs', type: 'Online', capacity: null, price: null, startDate: '2023-03-15 18:00:00', endDate: '2023-03-15 19:30:00', venueId: null, groupId: 9 },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events';
    const { Op } = require('sequelize');
    return queryInterface.bulkDelete(options, {
      name: { [ Op.in ]: [ 'Event1', 'Event2', 'Event3' ] }
    }, {});
  }
};
