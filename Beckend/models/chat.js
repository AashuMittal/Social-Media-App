const { DataTypes } = require('sequelize');
const sequelizeDb = require('../sequalizeDb'); 

const chat= sequelizeDb.define('chat', {

    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
   
   senderid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
   
   recieverid: {
        type: DataTypes.STRING,
        allowNull: false,
    },  

    Messagetype: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
    Message: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
    connectionid: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
}, {
    timestamps: true
});


(async () => {
    try {
        await chat.sync({ alter: true }); // Alter the table if changes are needed (development only)
        console.log('chat table has been created (if it didn\'t already exist).');
    } catch (error) {
        console.error('Unable to create table:', error);
    }
})();

module.exports = chat;
