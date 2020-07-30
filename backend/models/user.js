const { DataTypes } = require('sequelize');

function User(sequelize){
    sequelize.define('User', {
        // Model attributes are defined here
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}

module.exports = User;
