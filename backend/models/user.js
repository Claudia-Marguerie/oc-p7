'use strict';

const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userAdmin: DataTypes.BOOLEAN
  });
  sequelize.sync()
  return User;
}