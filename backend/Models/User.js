const sequelize = require('../connection/db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('User',{
   
    username: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: true
    },
    status:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    token:{
        type: DataTypes.STRING,
        allowNull: true
    },
     disable:{
        type: DataTypes.DATE,
        allowNull: true
     }
},{
    timestamps:true,
})

module.exports = User;