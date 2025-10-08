const {DataTypes} = require('sequelize');
const sequelize = require('../../config/database'); // Assuming you have a database configuration

const UserModel = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = UserModel;
