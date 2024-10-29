const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  QuestionID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  Text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  Subject: {
    type: DataTypes.ENUM('Mathématiques', 'Français', 'Histoire', 'Géographie', 'Sciences', 'Anglais'),
    allowNull: false,
  },
  Type: {
    type: DataTypes.ENUM('QCM', 'Texte à trous', 'Dictée'),
    allowNull: false,
  },
  Level: {
    type: DataTypes.ENUM('CP', 'CE1', 'CE2', 'CM1', 'CM2'),
    allowNull: false,
  },
  AuthorID: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ValidatorID: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ValidityDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'questions',
});

module.exports = Question;