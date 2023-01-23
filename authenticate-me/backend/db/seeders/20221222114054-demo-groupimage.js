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
    await queryInterface.bulkInsert(options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      url: { [ Op.in ]: [ 'img1.url', 'img2.url', 'img3.url' ] }
    })
  }
};
