const express = require('express');
const router = express.Router();
const { addCart, getCart, removeCart, updateCart, checkOut }= require("../controllers/cartController");

router.post("/addCart",addCart);
router.get('/getCart',getCart);
router.delete('/removeCart',removeCart);
router.post('/updateCart',updateCart);
router.post('/checkoutCart',checkOut);


module.exports = router;