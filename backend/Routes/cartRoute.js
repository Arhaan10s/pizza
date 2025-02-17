const express = require('express');
const router = express.Router();
const { addCart, getCart, removeCart, updateCart, checkOut } = require("../controllers/cartController");
const authorization = require('../Middleware/authenticate');

router.post("/addCart",authorization, addCart);
router.post('/getCart',authorization, getCart); // Changed to POST to include authorization
router.post('/removeCart', authorization,removeCart);
router.post('/updateCart',  authorization,updateCart);
router.post('/checkoutCart', authorization, checkOut);

module.exports = router;