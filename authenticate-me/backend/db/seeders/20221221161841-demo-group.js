'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    await queryInterface.bulkInsert(options, [
      {
        name: 'Event on the ocean',
        about: '[About is 50 characters]',
        type: 'Online',
        private: true,
        city: 'New York',
        state: 'NY',
        organizerId: 1
      },
      {
        name: 'Event on the lake',
        about: '[About is 50 characters]',
        type: 'In person',
        private: false,
        city: 'Los Angeles',
        state: 'NV',
        organizerId: 3
      },
      {
        name: 'Event on the beach',
        about: '[About is 50 characters]',
        type: 'In person',
        private: true,
        city: 'New York',
        state: 'NY',
        organizerId: 2
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Event on the ocean', 'Event on the beach', 'Event on the beach'] }
    }, {});
  }
}
