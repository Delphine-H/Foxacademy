const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const School = sequelize.define('School', {
  SchoolID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  SchoolName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DepartmentCode: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  City: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'schools',
});


module.exports = School;
