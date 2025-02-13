const express = require('express');
const router = express.Router();
const { addCart, getCart, removeCart, updateCart, checkOut } = require("../controllers/cartController");
const authorization = require('../Middleware/authenticate');

router.post("/addCart", addCart);
router.post('/getCart', getCart); // Changed to POST to include authorization
router.delete('/removeCart', removeCart);
router.post('/updateCart',  updateCart);
router.post('/checkoutCart',  checkOut);

module.exports = router;