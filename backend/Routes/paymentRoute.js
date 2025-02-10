const express = require('express');
const router = express.Router();
const { completePayment } = require('../controllers/paymentController');

router.post('/payment',completePayment);

module.exports= router;