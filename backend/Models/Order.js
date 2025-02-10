const sequelize = require('../connection/db');
const { DataTypes } = require('sequelize');
const Menu = require('./Menu');
const User = require('./User'); 

const Order = sequelize.define('Order', {
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    pizzaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Menu,
            key: 'pizzaId'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Dispatched', 'Recieved', 'Cancelled'),
        defaultValue: 'Pending',
        allowNull: false
    },
    payment:{
        type: DataTypes.ENUM('Cash','UPI','Card'),
        allowNull: false
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Associations
User.hasMany(Order, { foreignKey: 'id' });
Order.belongsTo(User, { foreignKey: 'id' });

Menu.hasMany(Order, { foreignKey: 'pizzaId' });
Order.belongsTo(Menu, { foreignKey: 'pizzaId' });

module.exports = Order;
