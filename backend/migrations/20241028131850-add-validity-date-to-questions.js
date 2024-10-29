'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Ajoutez la colonne avec allowNull: true
    await queryInterface.addColumn('questions', 'ValidityDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Mettre à jour les enregistrements existants avec une date par défaut
    await queryInterface.sequelize.query(`
      UPDATE questions
      SET "ValidityDate" = '2024-01-01'
      WHERE "ValidityDate" IS NULL
    `);

    // Modifier la colonne pour rendre allowNull: false
    await queryInterface.changeColumn('questions', 'ValidityDate', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('questions', 'ValidityDate');
  }
};
