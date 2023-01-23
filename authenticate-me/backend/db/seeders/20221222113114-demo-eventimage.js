'use strict';

// need this in all seeder and migration files
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    await queryInterface.bulkInsert(options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      url: { [ Op.in ]: [ 'photo1.url', 'photo2.url', 'photo3.url' ] }
    })
  }
};
