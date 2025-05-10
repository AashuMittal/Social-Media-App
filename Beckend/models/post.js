const { DataTypes } = require('sequelize');
const sequelizeDb = require('../sequalizeDb'); 

const post= sequelizeDb.define('post', {

    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
   
   photo: {
        type: DataTypes.STRING,
        allowNull: true,
    },  
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },  
}, {
    timestamps: true
});


(async () => {
    try {
        await post.sync({ alter: true }); // Alter the table if changes are needed (development only)
        console.log('post table has been created (if it didn\'t already exist).');
    } catch (error) {
        console.error('Unable to create table:', error);
    }
})();

module.exports = post;
