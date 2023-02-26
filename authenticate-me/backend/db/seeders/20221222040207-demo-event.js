'use strict';

// need this in all seeder and migration files
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


const text = 'Breakfast agreeable incommode departure it an. By ignorant at on wondered relation. Enough at tastes really so cousin am of. Extensive therefore supported by extremity of contented. Is pursuit compact demesne invited elderly be. View him she roof tell her case has sigh. Moreover is possible he admitted sociable concerns. By in cold no less been sent hard hill. Improve him believe opinion offered met and end cheered forbade. Friendly as stronger speedily by recurred. Son interest wandered sir addition end say. Manners beloved affixed picture men ask. Explain few led parties attacks picture company. On sure fine kept walk am in it. Resolved to in believed desirous unpacked weddings together. Nor off for enjoyed cousins herself. Little our played lively she adieus far sussex. Do theirs others merely at temper it nearer. Next his only boy meet the fat rose when. Do repair at we misery wanted remove remain income. Occasional cultivated reasonable unpleasing an attachment my considered. Having ask and coming object seemed put did admire figure. Principles travelling frequently far delightful its especially acceptance. Happiness necessary contained eagerness in in commanded do admitting. Favourable continuing difficulty had her solicitude far. Nor doubt off widow all death aware offer. We will up able in both do sing. An so vulgar to on points wanted. Not rapturous resolving continued household northward gay. He it otherwise supported instantly. Unfeeling agreeable suffering it on smallness newspaper be. So come must time no as. Do on unpleasing possession as of unreserved. Yet joy exquisite put sometimes enjoyment perpetual now. Behind lovers eat having length horses vanity say had its.';



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Events';
    await queryInterface.bulkInsert(options, [
      { name: 'Summer Concert Series', description: text, type: 'In person', capacity: 500, price: 0, startDate: '2024-07-01 19:00:00', endDate: '2024-07-01 22:00:00', venueId: 1, groupId: 1 },
      { name: 'Book Club Meeting', description: text, type: 'Online', capacity: null, price: null, startDate: '2024-08-15 18:00:00', endDate: '2024-08-15 19:30:00', venueId: null, groupId: 2 },
      { name: 'Networking Event', description: text, type: 'In person', capacity: 200, price: 20, startDate: '2024-09-20 17:00:00', endDate: '2024-09-20 20:00:00', venueId: 2, groupId: 3 },
      { name: 'Yoga in the Park', description: text, type: 'In person', capacity: 100, price: 10, startDate: '2024-10-10 09:00:00', endDate: '2024-10-10 10:30:00', venueId: 1, groupId: 4 },
      { name: 'Tech Workshop', description: text, type: 'Online', capacity: null, price: null, startDate: '2024-11-01 19:00:00', endDate: '2024-11-01 21:00:00', venueId: null, groupId: 5 },
      { name: 'Art Show', description: text, type: 'In person', capacity: 50, price: 0, startDate: '2024-12-05 14:00:00', endDate: '2024-12-05 17:00:00', venueId: 2, groupId: 6 },
      { name: 'Dinner Party', description: text, type: 'In person', capacity: 12, price: null, startDate: '2024-01-15 19:00:00', endDate: '2024-01-15 22:00:00', venueId: 1, groupId: 7 },
      { name: 'Trivia Night', description: text, type: 'In person', capacity: 100, price: 0, startDate: '2024-02-01 19:00:00', endDate: '2024-02-01 21:00:00', venueId: 2, groupId: 8 },
      { name: 'Gardening Class', description: text, type: 'Online', capacity: null, price: null, startDate: '2024-03-15 18:00:00', endDate: '2024-03-15 19:30:00', venueId: null, groupId: 9 }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events';
    const { Op } = require('sequelize');
    return queryInterface.bulkDelete(options);
  }
};
