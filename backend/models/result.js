const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Result = sequelize.define('Result', {
  ResultID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  UserID: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'UserID',
    },
  },
  QuestionID: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'questions',
      key: 'QuestionID',
    },
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
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'results',
});

module.exports = Result;