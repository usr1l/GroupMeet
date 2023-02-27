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
    const imgURL = "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thewowstyle.com%2Fwp-content%2Fuploads%2F2015%2F01%2Fnature-image.jpg&f=1&nofb=1&ipt=618c86c394da17101140c4811c973e26d74f3499a9ad58e561f4f8932782ecee&ipo=images";

    await queryInterface.bulkInsert(options, [
      { url: imgURL, preview: true, eventId: 1 },
      { url: imgURL, preview: true, eventId: 2 },
      { url: imgURL, preview: true, eventId: 3 },
      { url: imgURL, preview: true, eventId: 4 },
      { url: imgURL, preview: true, eventId: 5 },
      { url: imgURL, preview: true, eventId: 6 },
      { url: imgURL, preview: true, eventId: 7 },
      { url: imgURL, preview: true, eventId: 8 },
      { url: imgURL, preview: true, eventId: 9 }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const { Op } = require('sequelize');
    return queryInterface.bulkDelete(options);
  }
};
