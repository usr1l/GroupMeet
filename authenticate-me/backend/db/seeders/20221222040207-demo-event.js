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
      { name: 'Summer Concert Series', description: 'Annual concert series featuring local musicians', type: 'In person', capacity: 500, price: 0, startDate: '2022-07-01 19:00:00', endDate: '2022-07-01 22:00:00', venueId: 1, groupId: 1, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facidcow.com%2Fpics%2F20090702%2F8%2Fcats_12.jpg&f=1&nofb=1&ipt=3e6029b841d588eef6ca49fc03b932a306dae50b0140263f3eca402239601eef&ipo=images" },
      { name: 'Book Club Meeting', description: 'Monthly meeting to discuss the latest book selection', type: 'Online', capacity: null, price: null, startDate: '2022-08-15 18:00:00', endDate: '2022-08-15 19:30:00', venueId: null, groupId: 2, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facidcow.com%2Fpics%2F20090702%2F8%2Fcats_12.jpg&f=1&nofb=1&ipt=3e6029b841d588eef6ca49fc03b932a306dae50b0140263f3eca402239601eef&ipo=images" },
      { name: 'Networking Event', description: 'Opportunity for professionals to connect and network', type: 'In person', capacity: 200, price: 20, startDate: '2022-09-20 17:00:00', endDate: '2022-09-20 20:00:00', venueId: 2, groupId: 3, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facidcow.com%2Fpics%2F20090702%2F8%2Fcats_12.jpg&f=1&nofb=1&ipt=3e6029b841d588eef6ca49fc03b932a306dae50b0140263f3eca402239601eef&ipo=images" },
      { name: 'Yoga in the Park', description: 'Outdoor yoga class open to all skill levels', type: 'In person', capacity: 100, price: 10, startDate: '2022-10-10 09:00:00', endDate: '2022-10-10 10:30:00', venueId: 1, groupId: 4, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facidcow.com%2Fpics%2F20090702%2F8%2Fcats_12.jpg&f=1&nofb=1&ipt=3e6029b841d588eef6ca49fc03b932a306dae50b0140263f3eca402239601eef&ipo=images" },
      { name: 'Tech Workshop', description: 'Workshop to learn about the latest technology trends', type: 'Online', capacity: null, price: null, startDate: '2022-11-01 19:00:00', endDate: '2022-11-01 21:00:00', venueId: null, groupId: 5, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facidcow.com%2Fpics%2F20090702%2F8%2Fcats_12.jpg&f=1&nofb=1&ipt=3e6029b841d588eef6ca49fc03b932a306dae50b0140263f3eca402239601eef&ipo=images" },
      { name: 'Art Show', description: 'Local artists showcase their work', type: 'In person', capacity: 50, price: 0, startDate: '2022-12-05 14:00:00', endDate: '2022-12-05 17:00:00', venueId: 2, groupId: 6, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facidcow.com%2Fpics%2F20090702%2F8%2Fcats_12.jpg&f=1&nofb=1&ipt=3e6029b841d588eef6ca49fc03b932a306dae50b0140263f3eca402239601eef&ipo=images" },
      { name: 'Dinner Party', description: 'Private dinner party for friends and family', type: 'In person', capacity: 12, price: null, startDate: '2023-01-15 19:00:00', endDate: '2023-01-15 22:00:00', venueId: 1, groupId: 7, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facidcow.com%2Fpics%2F20090702%2F8%2Fcats_12.jpg&f=1&nofb=1&ipt=3e6029b841d588eef6ca49fc03b932a306dae50b0140263f3eca402239601eef&ipo=images" },
      { name: 'Trivia Night', description: 'Weekly trivia competition with prizes', type: 'In person', capacity: 100, price: 0, startDate: '2023-02-01 19:00:00', endDate: '2023-02-01 21:00:00', venueId: 2, groupId: 8, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facidcow.com%2Fpics%2F20090702%2F8%2Fcats_12.jpg&f=1&nofb=1&ipt=3e6029b841d588eef6ca49fc03b932a306dae50b0140263f3eca402239601eef&ipo=images" },
      { name: 'Gardening Class', description: 'Learn how to grow your own vegetables and herbs', type: 'Online', capacity: null, price: null, startDate: '2023-03-15 18:00:00', endDate: '2023-03-15 19:30:00', venueId: null, groupId: 9, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facidcow.com%2Fpics%2F20090702%2F8%2Fcats_12.jpg&f=1&nofb=1&ipt=3e6029b841d588eef6ca49fc03b932a306dae50b0140263f3eca402239601eef&ipo=images" }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events';
    const { Op } = require('sequelize');
    return queryInterface.bulkDelete(options);
  }
};
