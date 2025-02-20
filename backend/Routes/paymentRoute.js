const express = require('express');
const router = express.Router();
const { completePayment,getPayment } = require('../controllers/paymentController');
const authenticate = require('../Middleware/authenticate');

router.post('/completePayment',authenticate,completePayment);
router.post('/getPayment',authenticate,getPayment);
module.exports= router;