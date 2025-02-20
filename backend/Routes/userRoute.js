const express = require('express');
const router = express.Router();
const { register, logIn,getUser, logOut, getOrders, forgetPassword,getPizza, deleteUser, received, cancelOrder } = require("../controllers/userController");
const authenticate = require('../Middleware/authenticate');

router.post('/registerUser',register);
router.post('/signInUser',logIn);
router.post('/getUser',authenticate,getUser);
router.post('/logOutUser',logOut);
router.post('/getOrder',authenticate,getOrders);
router.post('/forgetPasswordUser',forgetPassword);
router.delete('/deleteUser',deleteUser);
router.post('/received',authenticate,received);
router.post('/cancelOrder',cancelOrder);
router.get('/user/getPizza',getPizza)


module.exports = router;