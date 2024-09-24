const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Result = sequelize.define('Result', {
  ResultID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  LastEvaluated: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Subject: {
    type: DataTypes.ENUM('Mathématiques', 'Français', 'Histoire', 'Géographie', 'Sciences', 'Anglais'),
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Result;
