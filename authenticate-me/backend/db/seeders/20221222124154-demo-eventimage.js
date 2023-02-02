'use strict';

// need this in all seeder and migration files
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'EventImages'
    await queryInterface.bulkInsert(options, [
      { url: 'https://iezombie.net/wp-content/uploads/2019/04/asylumelements-016.png', preview: true, eventId: 1 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/04/asylumelements-016.png', preview: true, eventId: 2 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/04/asylumelements-016.png', preview: true, eventId: 3 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/04/asylumelements-016.png', preview: true, eventId: 4 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/04/asylumelements-016.png', preview: true, eventId: 5 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/04/asylumelements-016.png', preview: true, eventId: 6 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/04/asylumelements-016.png', preview: true, eventId: 7 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/04/asylumelements-016.png', preview: true, eventId: 8 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/04/asylumelements-016.png', preview: true, eventId: 9 }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const { Op } = require('sequelize');
    return queryInterface.bulkDelete(options);
  }
};
