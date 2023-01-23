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
      { name: 'Hiking Enthusiasts', about: 'Group for people who love to hike and explore the great outdoors', type: 'In person', private: false, city: 'San Francisco', state: 'CA', organizerId: 1, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Foodies Unite', about: 'Group for people who love to try new restaurants and share recipes', type: 'In person', private: false, city: 'Los Angeles', state: 'CA', organizerId: 2, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Book Club', about: 'Group for people who love to read and discuss books', type: 'Online', private: false, city: 'New York', state: 'NY', organizerId: 3, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Yoga Lovers', about: 'Group for people who love to practice yoga and find inner peace', type: 'In person', private: false, city: 'Chicago', state: 'IL', organizerId: 1, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Photography Club', about: 'Group for people who love to take photos and share tips and tricks', type: 'In person', private: false, city: 'Houston', state: 'TX', organizerId: 2, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Wine Tasting Group', about: 'Group for people who love to taste and learn about wine', type: 'In person', private: false, city: 'Phoenix', state: 'AZ', organizerId: 3, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Tech Enthusiasts', about: 'Group for people who love to learn about and discuss new technology', type: 'Online', private: false, city: 'Philadelphia', state: 'PA', organizerId: 1, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Gardening Club', about: 'Group for people who love to garden and share tips and tricks', type: 'In person', private: false, city: 'San Antonio', state: 'TX', organizerId: 2, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Running Group', about: 'Group for people who love to run and stay active', type: 'In person', private: false, city: 'San Diego', state: 'CA', organizerId: 3, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Art Appreciation Group', about: 'Group for people who love to appreciate and discuss art', type: 'In person', private: false, city: 'Dallas', state: 'TX', organizerId: 1, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Music Lovers', about: 'Group for people who love to listen to and discuss music', type: 'Online', private: false, city: 'San Jose', state: 'CA', organizerId: 2, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Fitness Fanatics', about: 'Group for people who love to stay active and healthy', type: 'In person', private: false, city: 'Austin', state: 'TX', organizerId: 3, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
      { name: 'Cooking Club', about: 'Group for people who love to cook and share recipes', type: 'In person', private: false, city: 'Jacksonville', state: 'FL', organizerId: 1, previewImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FLjCVFg8cL6c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=5031f508bc4668cd89a7b5df605caa250bed344b3cec0e08f95de43d3609b600&ipo=images" },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [ Op.in ]: [ 'Event on the ocean', 'Event on the beach', 'Event on the beach' ] }
    }, {});
  }
}
