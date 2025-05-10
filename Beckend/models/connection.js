const { DataTypes } = require('sequelize');
const sequelizeDb = require('../sequalizeDb'); 

const connection= sequelizeDb.define('Connectionchat', {

    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user1id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
   
   user2id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },    
});


(async () => {
    try {
        await connection.sync({ alter: true }); // Alter the table if changes are needed (development only)
        console.log('connection table has been created (if it didn\'t already exist).');
    } catch (error) {
        console.error('Unable to create table:', error);
    }
})();

module.exports = connection;
