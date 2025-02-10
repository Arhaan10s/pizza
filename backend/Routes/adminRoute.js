const express = require('express');
const router = express.Router();
const { register, logIn, getAdmin, logOut, getOrders, forgetPassword, deleteAdmin, addPizza, getPizza, getAvailableOptions } = require("../controllers/adminController");
const authenticate = require('../Middleware/authenticate');
const upload = require('../Middleware/upload');

router.post('/registerAdmin', register);
router.post('/signInAdmin', logIn);
router.get('/getAdmin', authenticate, getAdmin);
router.post('/logOutAdmin', logOut);
router.post('/forgetPasswordAdmin', forgetPassword);
router.delete('/deleteAdmin', deleteAdmin);
router.post('/admin/addPizza', upload.single('image'), addPizza);
router.get('/admin/getPizza', getPizza);
router.get('/admin/getOrder', getOrders);
router.get('/admin/getAvailableOptions', getAvailableOptions);

module.exports = router;