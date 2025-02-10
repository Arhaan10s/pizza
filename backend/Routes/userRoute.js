const express = require('express');
const router = express.Router();
const { register, logIn,getUser, logOut, getOrders, forgetPassword,getPizza, deleteUser, recieved, cancelOrder } = require("../controllers/userController");
const authenticate = require('../Middleware/authenticate');

router.post('/registerUser',register);
router.post('/signInUser',logIn);
router.get('/getUser',authenticate,getUser);
router.post('/logOutUser',logOut);
router.get('/getOrder',getOrders);
router.post('/forgetPasswordUser',forgetPassword);
router.delete('/deleteUser',deleteUser);
router.post('/recieved',recieved);
router.post('/cancelOrder',cancelOrder);
router.get('/user/getPizza',getPizza)


module.exports = router;