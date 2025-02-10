const sequelize = require('../connection/db');
const User = require('./User');
const Admin = require('./Admin');
const Menu = require('./Menu');
const Otp = require('./Otps');
const Order = require('./Order');
const Cart = require('./Cart');
const Payment = require('./Payment');

sequelize.sync({alter:true})
    .then(()=>{
        console.log("All tables created successfully")
    })
    .catch(err => console.log("Error creating tables"))

module.exports =sequelize;