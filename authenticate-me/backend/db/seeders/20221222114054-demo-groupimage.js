'use strict';

// need this in all seeder and migration files
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const imgURL = 'https://media.istockphoto.com/id/1047897858/photo/new-orleans-louisiana-usa-downtown-skyline-aerial.jpg?s=612x612&w=0&k=20&c=nbhm_C4lSKgixgYcCy6Q_h32jKw9LAY9HxEjC2zspdg=';

    await queryInterface.bulkInsert(options, [
      { url: imgURL, preview: true, groupId: 1 },
      { url: imgURL, preview: true, groupId: 2 },
      { url: imgURL, preview: true, groupId: 3 },
      { url: imgURL, preview: true, groupId: 4 },
      { url: imgURL, preview: true, groupId: 5 },
      { url: imgURL, preview: true, groupId: 6 },
      { url: imgURL, preview: true, groupId: 7 },
      { url: imgURL, preview: true, groupId: 8 },
      { url: imgURL, preview: true, groupId: 9 },
      { url: imgURL, preview: true, groupId: 10 },
      { url: imgURL, preview: true, groupId: 11 },
      { url: imgURL, preview: true, groupId: 12 },
      { url: imgURL, preview: true, groupId: 13 }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const { Op } = require('sequelize');
    return queryInterface.bulkDelete(options);
  }
};
