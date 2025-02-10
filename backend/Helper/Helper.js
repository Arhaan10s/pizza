const Helper = {};
const db = require('../connection/db');

const toppingPrices = {
    Capsicum: 25.0,
    Paneer:50,
    Tomato: 25.0,
    Cheese: 35.0,
    Olives: 25.0,
    Mushroom: 25.0,
    Onion: 25.0,
    Chicken: 70.0,
    Mutton: 100.0
};

// Size price adjustments
const sizePrices = {
    Regular: 200.0,
    Medium: 500.0,
    Large: 800.0
};

// Category-based price adjustments
const categoryPrices = {
    Veg: 100.0,
    NonVeg: 100.0
};

const allowedToppings = Object.keys(toppingPrices)
console.log('>>>>h',allowedToppings); // This will generate ['Capsicum', 'Tomato', 'Cheese', 'Olives', 'Mushroom', 'Onion']
const allowedSizes = Object.keys(sizePrices); // This will generate ['Regular', 'Medium', 'Large']

Helper.calculateTotalPrice = (basePrice, category, size, toppings) => {
    const categoryCost = categoryPrices[category] || 0;
    const sizeCost = sizePrices[size] || 0;

    const toppingsCost = toppings.reduce((total, topping) => {
        return total + (toppingPrices[topping] || 0);
    }, 0);

    return basePrice + categoryCost + sizeCost + toppingsCost;
}

module.exports = {
    calculateTotalPrice: Helper.calculateTotalPrice,
    allowedToppings,
    allowedSizes
};