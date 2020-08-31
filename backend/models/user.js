'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        lastname: DataTypes.STRING,
        firstname: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        userAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {});

    User.associate = function (models) {
        models.User.hasMany(models.Post, {onDelete: 'cascade'})
    }

    return User;
};