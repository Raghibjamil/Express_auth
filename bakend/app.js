const express=require('express');
const app=express();
// const cors = require("cors")

const authRouter=require('./router/authRouter');
const databaseconnect=require('./config/databaseConfig');
const cookieParser = require('cookie-parser');
const cors = require('cors');



databaseconnect();

app.use(express.json());
app.use(cookieParser()); 

// app.use(cors());
app.use(cors({
    origin:"http://127.0.0.1:5500",
    credentials:true
}));



// app.use("/random",)
app.use('/api/auth',authRouter);
//authRouter=>controller...

app.use('/',(req,res,next)=>{
    res.status(200).json({data:"JWT auth server updated!!!"});
    //JWT =>json web token
})

module.exports=app;