const { DataTypes } = require('sequelize');
const sequelizeDb = require('../sequalizeDb'); 

const postcomment= sequelizeDb.define('postcomment', {

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
    comment: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
}, {
    timestamps: true
});


(async () => {
    try {
        await postcomment.sync({ alter: true }); // Alter the table if changes are needed (development only)
        console.log('postcomment table has been created (if it didn\'t already exist).');
    } catch (error) {
        console.error('Unable to create table:', error);
    }
})();

module.exports = postcomment;
