'use strict';

// need this in all seeder and migration files
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    await queryInterface.bulkInsert(options, [
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 1 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 2 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 3 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 4 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 5 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 6 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 7 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 8 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 9 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 10 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 11 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 12 },
      { url: 'https://iezombie.net/wp-content/uploads/2019/03/asylumelements-013.png', preview: true, groupId: 13 }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const { Op } = require('sequelize');
    return queryInterface.bulkDelete(options);
  }
};
