const sequelize = require('../connection/db');
const { DataTypes } = require('sequelize');
const Menu = require('./Menu');
const User = require('./User'); 
const Payment = require('./Payment');
const Helper = require('../Helper/Helper'); 


const Cart = sequelize.define('Cart', {
    cartId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    pizzaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Menu,
            key: 'pizzaId'
        }
    },
    categories: {
        type: DataTypes.ENUM('Veg', 'Non-Veg'),
        allowNull: false,
    },
    toppings: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        validate: {
            isAllowedToppings(value) {
                // Ensure value is an array
                if (Array.isArray(value)) {
                    // Validate each topping in the array
                    if (!value.every(topping => Helper.allowedToppings.includes(topping))) {
                        throw new Error(`Invalid topping(s). Allowed toppings are: ${Helper.allowedToppings.join(', ')}`);
                    }
                } else {
                    throw new Error('Toppings should be an array of strings');
                }
            }
        }
    },
    sizes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
            isAllowedSizes(value) {
                if (Array.isArray(value)) {
                    // Validate each size in the array
                    if (!value.every(size => Helper.allowedSizes.includes(size))) {
                        throw new Error(`Invalid size(s). Allowed sizes are: ${Helper.allowedSizes.join(', ')}`);
                    }
                } else {
                    throw new Error('Sizes should be an array of strings');
                }
            }
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    }
});

User.belongsToMany(Menu,{through: Cart,foreignKey:'id'})
Menu.belongsToMany(User,{through: Cart,foreignKey:'pizzaId'})

// Associations
User.hasMany(Cart, { foreignKey: 'id' });
Cart.belongsTo(User, { foreignKey: 'id' });

Payment.belongsTo(Cart, { foreignKey: 'id' });
Cart.hasMany(Payment, { foreignKey: 'id' });

Menu.hasMany(Cart, { foreignKey: 'pizzaId' });
Cart.belongsTo(Menu, { foreignKey: 'pizzaId' });

module.exports = Cart;
