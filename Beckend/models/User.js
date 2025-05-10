const { DataTypes } = require('sequelize');
const sequalizeDb = require('../sequalizeDb'); // Adjust path if necessary

const User = sequalizeDb.define('Authentication', {
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
   
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false, // Ensure usernames are unique
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false, // Ensure usernames are unique
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },   
    photo: {
        type: DataTypes.STRING,
        allowNull: true,
    },   
});

// Sync the model with the database
(async () => {
    try {
        await User.sync(); // Creates the table if it doesn't exist
        console.log('User table has been created (if it didn\'t already exist).');
    } catch (error) {
        console.error('Unable to create table:', error);
    }
})();

module.exports =User;
