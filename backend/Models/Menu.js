const sequelize = require('../connection/db');
const { DataTypes } = require('sequelize');
const Admin = require('../Models/Admin');
const Helper = require('../Helper/Helper'); 

const Menu = sequelize.define('Menu', {
    adminId:{
        type: DataTypes.INTEGER,
        references:{
            model:Admin,
            key:'adminId',
        }
    },
    pizza: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pizzaId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    image:{
        type: DataTypes.STRING,
    },
    categories: {
        type: DataTypes.ENUM('Veg', 'Non-Veg'),
        allowNull: false,
    },
    basePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 100.0 // Default base price for a pizza
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
    totalPrice: {
        type: DataTypes.VIRTUAL,
        get() {
            return Helper.calculateTotalPrice(
                this.getDataValue('basePrice') || 0,
                this.getDataValue('categories') || 'Veg',
                this.getDataValue('size') || 'Regular',
                this.getDataValue('toppings') || []
            );
        }
    }
});

// Define the relation between Admin and Menu
Admin.hasMany(Menu, { foreignKey: 'adminId' });
Menu.belongsTo(Admin, { foreignKey: 'adminId' });

module.exports = Menu;
