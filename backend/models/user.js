const { DataTypes } = require('sequelize');

function User(sequelize){
    sequelize.define('User', {
        // Model attributes are defined here
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING
            // allowNull defaults to true
        },
        birthDate: {
            type: DataTypes.DATE
        }
    });
}

module.exports = User;
