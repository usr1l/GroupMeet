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
      { name: 'Hiking Enthusiasts', about: 'Group for people who love to hike and explore the great outdoors', type: 'In person', private: false, city: 'San Francisco', state: 'CA', organizerId: 1 },
      { name: 'Foodies Unite', about: 'Group for people who love to try new restaurants and share recipes', type: 'In person', private: false, city: 'Los Angeles', state: 'CA', organizerId: 2 },
      { name: 'Book Club', about: 'Group for people who love to read and discuss books', type: 'Online', private: false, city: 'New York', state: 'NY', organizerId: 3 },
      { name: 'Yoga Lovers', about: 'Group for people who love to practice yoga and find inner peace', type: 'In person', private: false, city: 'Chicago', state: 'IL', organizerId: 1 },
      { name: 'Photography Club', about: 'Group for people who love to take photos and share tips and tricks', type: 'In person', private: false, city: 'Houston', state: 'TX', organizerId: 2 },
      { name: 'Wine Tasting Group', about: 'Group for people who love to taste and learn about wine', type: 'In person', private: false, city: 'Phoenix', state: 'AZ', organizerId: 3 },
      { name: 'Tech Enthusiasts', about: 'Group for people who love to learn about and discuss new technology', type: 'Online', private: false, city: 'Philadelphia', state: 'PA', organizerId: 1 },
      { name: 'Gardening Club', about: 'Group for people who love to garden and share tips and tricks', type: 'In person', private: false, city: 'San Antonio', state: 'TX', organizerId: 2 },
      { name: 'Running Group', about: 'Group for people who love to run and stay active', type: 'In person', private: false, city: 'San Diego', state: 'CA', organizerId: 3 },
      { name: 'Art Appreciation Group', about: 'Group for people who love to appreciate and discuss art', type: 'In person', private: false, city: 'Dallas', state: 'TX', organizerId: 1 },
      { name: 'Music Lovers', about: 'Group for people who love to listen to and discuss music', type: 'Online', private: false, city: 'San Jose', state: 'CA', organizerId: 2 },
      { name: 'Fitness Fanatics', about: 'Group for people who love to stay active and healthy', type: 'In person', private: false, city: 'Austin', state: 'TX', organizerId: 3 },
      { name: 'Cooking Club', about: 'Group for people who love to cook and share recipes', type: 'In person', private: false, city: 'Jacksonville', state: 'FL', organizerId: 1 },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
  }
}
