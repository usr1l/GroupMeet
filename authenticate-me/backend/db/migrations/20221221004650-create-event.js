'use strict';

// need this in all seeder and migration files
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Events';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(options, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('In person', 'Online'),
        allowNull: false
      },
      capacity: {
        type: Sequelize.INTEGER,
        // allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL,
        // allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      venueId: {
        type: Sequelize.INTEGER,
        references: { model: 'Venues' },
        onDelete: 'SET NULL',
        hooks: true
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Groups' },
        onDelete: 'CASCADE',
        hooks: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(options);
  }
};
