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
    await queryInterface.bulkInsert(options, [
      {
        url: 'img1.url',
        preview: false,
        groupId: 1
      },
      {
        url: 'img2.url',
        preview: true,
        groupId: 2
      },
      {
        url: 'img3.url',
        preview: true,
        groupId: 3
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['img1.url', 'img2.url', 'img3.url'] }
    })
  }
};
