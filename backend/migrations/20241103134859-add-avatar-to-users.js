'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'Avatar', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'avatar0',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'Avatar');
  }
};