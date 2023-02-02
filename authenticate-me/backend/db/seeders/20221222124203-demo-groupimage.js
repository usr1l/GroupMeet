'use strict';

// need this in all seeder and migration files
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {


  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const { Op } = require('sequelize');
    return queryInterface.bulkDelete(options);
  }
};
