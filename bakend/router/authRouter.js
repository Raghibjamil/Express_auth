const express=require('express');
const { sign } = require('jsonwebtoken');
const jwtAuth = require("../middleware/jwtAuth");

// const jwtAuth=require("../middleware/jwtAuth");
const { signup, signin, getUser,logout } = require('../controller/authController');
const authRouter=express.Router();
authRouter.post('/signup',signup)
authRouter.post('/signin',signin)
authRouter.get("/user", jwtAuth, getUser);
authRouter.get("/logout",jwtAuth,logout)
module.exports=authRouter;