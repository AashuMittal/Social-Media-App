const { DataTypes } = require('sequelize');
const sequelizeDb = require('../sequalizeDb'); 

const postLike= sequelizeDb.define('postLike', {

    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
   
   userid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
   
   postid: {
        type: DataTypes.STRING,
        allowNull: false,
    },  
    like: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
}, {
    timestamps: true
});


(async () => {
    try {
        await postLike.sync({ alter: true }); // Alter the table if changes are needed (development only)
        console.log('postLike table has been created (if it didn\'t already exist).');
    } catch (error) {
        console.error('Unable to create table:', error);
    }
})();

module.exports = postLike;
