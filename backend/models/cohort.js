const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cohort = sequelize.define('Cohort', {
  CohortID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Level: {
    type: DataTypes.ENUM('CP', 'CE1', 'CE2', 'CM1', 'CM2'),
    allowNull: false,
  },
  SchoolID: {
    type: DataTypes.TEXT,
    references: {
      model: 'schools', 
      key: 'SchoolID',
    },
  },
});

module.exports = Cohort;
