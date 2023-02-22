'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const text = "Gave read use way make spot how nor. In daughter goodness an likewise oh consider at procured wandered. Songs words wrong by me hills heard timed. Happy eat may doors songs. Be ignorant so of suitable dissuade weddings together. Least whole timed we is. An smallness deficient discourse do newspaper be an eagerness continued. Mr my ready guest ye after short at. Now seven world think timed while her. Spoil large oh he rooms on since an. Am up unwilling eagerness perceived incommode. Are not windows set luckily musical hundred can. Collecting if sympathize middletons be of of reasonably. Horrible so kindness at thoughts exercise no weddings subjects. The mrs gay removed towards journey chapter females offered not. Led distrusts otherwise who may newspaper but. Last he dull am none he mile hold as. Use securing confined his shutters. Delightful as he it acceptance an solicitude discretion reasonably. Carriage we husbands advanced an perceive greatest. Totally dearest expense on demesne ye he. Curiosity excellent commanded in me. Unpleasing impression themselves to at assistance acceptance my or. On consider laughter civility offended oh. Remain lively hardly needed at do by. Two you fat downs fanny three. True mr gone most at. Dare as name just when with it body. Travelling inquietude she increasing off impossible the. Cottage be noisier looking to we promise on. Disposal to kindness appetite diverted learning of on raptures. Betrayed any may returned now dashwood formerly. Balls way delay shy boy man views. No so instrument discretion unsatiable to in."


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    await queryInterface.bulkInsert(options, [
      { name: 'Hiking Enthusiasts', about: text, type: 'In person', private: false, city: 'San Francisco', state: 'CA', organizerId: 1 },
      { name: 'Foodies Unite', about: text, type: 'In person', private: false, city: 'Los Angeles', state: 'CA', organizerId: 2 },
      { name: 'Book Club', about: text, type: 'Online', private: false, city: 'New York', state: 'NY', organizerId: 3 },
      { name: 'Yoga Lovers', about: text, type: 'In person', private: false, city: 'Chicago', state: 'IL', organizerId: 1 },
      { name: 'Photography Club', about: text, type: 'In person', private: false, city: 'Houston', state: 'TX', organizerId: 2 },
      { name: 'Wine Tasting Group', about: text, type: 'In person', private: false, city: 'Phoenix', state: 'AZ', organizerId: 3 },
      { name: 'Tech Enthusiasts', about: text, type: 'Online', private: false, city: 'Philadelphia', state: 'PA', organizerId: 1 },
      { name: 'Gardening Club', about: text, type: 'In person', private: false, city: 'San Antonio', state: 'TX', organizerId: 2 },
      { name: 'Running Group', about: text, type: 'In person', private: false, city: 'San Diego', state: 'CA', organizerId: 3 },
      { name: 'Art Appreciation Group', about: text, type: 'In person', private: false, city: 'Dallas', state: 'TX', organizerId: 1 },
      { name: 'Music Lovers', about: text, type: 'Online', private: false, city: 'San Jose', state: 'CA', organizerId: 2 },
      { name: 'Fitness Fanatics', about: text, type: 'In person', private: false, city: 'Austin', state: 'TX', organizerId: 3 },
      { name: 'Cooking Club', about: text, type: 'In person', private: false, city: 'Jacksonville', state: 'FL', organizerId: 1 },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
  }
}
