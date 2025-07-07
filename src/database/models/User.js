const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lang: {
    type: DataTypes.STRING(10),
    defaultValue: 'ru'
  }
}, {
  tableName: 'Users',
  timestamps: false
});

module.exports = User; 