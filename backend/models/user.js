const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  Level: {
    type: DataTypes.ENUM('CP', 'CE1', 'CE2', 'CM1', 'CM2'),
    allowNull: false,
  },
  Role: {
    type: DataTypes.ENUM('Professeur', 'Elève'),
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  TotalScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  SchoolID: {
    type: DataTypes.TEXT,
    references: {
      model: 'schools',
      key: 'SchoolID',
    },
  },
  CohortID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'cohorts',
      key: 'CohortID',
    },
  },
}, {
  timestamps: true,
  tableName: 'users',
});

module.exports = User;
