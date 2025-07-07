const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ChanelId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  LoggingId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  SupportUsername: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nameproject: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Settings',
  timestamps: false
});

module.exports = Setting; 