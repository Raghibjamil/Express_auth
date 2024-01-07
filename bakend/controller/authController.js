const userModel = require("../model/userSchema");
const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");

const signup=async (req,res,next)=>{
    const {name,email,password,confirmpassword}=req.body;
    console.log(name,email,password,confirmpassword);



    if (!name || !email || !password || !confirmpassword) {
        return res.status(400).json({
          success: false,
          message: "Every field is required"
        });
      }
    
      //validate email using npm package "email-validator"
      const validEmail = emailValidator.validate(email);
      if (!validEmail) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address "
        });
      }
    
 
      // send password not match err if password !== confirmPassword
      if (password !== confirmpassword) {
        return res.status(400).json({
          success: false,
          message: "password and confirm Password does not match "
        });
    }


    try{
          
        const userInfo=userModel(req.body);
      
        const result=await userInfo.save();
    
    
        return res.status(200).json({
            succuess:true,
        data:result
    })
    }catch(e){
            if(e.code === 11000){

                return res.status(400)
                .json({
                    succuess:false,
                    message:"Account already exists with provided email id"
                })
            };
            return req.status(400).json({
                succuess:false,
                message:e.message
            })
    }
      }

      // Signin function started....
      const signin=async (req,res)=>{
            const {email,password}=req.body;
            console.log(email,password)
            if(!email||!password){
                return res.status(400).
                json({
                    success:false,
                    message:"Every field is mandotry"
                })
            }

            try{
                const user=await userModel.findOne({email}).
                select('+password');
              

                // user.password :- joh database meh stored password hai woh hai...
                // password :- joh user sign in keh password dal rha hai woh hai

    
                if(!user||!(await bcrypt.compare(password, user.password))){
                        // bcrypt.compare returns boolean value
                    return res.status(400).
                    json({
                        success:false,
                        message:"invalid credential"
                    })
                }

                // Create jwt token using userSchema method( jwtToken() )
    const token = await user.jwtToken();
    // printing the token....
    //console.log(token);
    user.password = undefined;// this will help in erasing the password of user.....


    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000, //24hr
      // httpOnly: true //  not able to modify  the cookie in client side
    };

    res.cookie("token", token, cookieOption);
    // res.send("cookie is created")
    res.status(200).json({
      success: true,
      data: user,
      // token:token
    });
            }
            catch(error){
                return res.status(400).json({
                    success: false,
                    message: error.message
                  });
            }
    
      };

      // getuser method ................
      const getUser = async (req, res, next) => {
        const userId = req.user.id;
        try {
          const user = await userModel.findById(userId);
          return res.status(200).json({
            success: true,
            data: user
          });
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
      };

      // logout .............
      const logout = async (req, res, next) => {
        try {
          const cookieOption = {
            expires: new Date(), // current expiry date
            httpOnly: true //  not able to modify  the cookie in client side
          };
      
          // return response with cookie without token
          res.cookie("token", null, cookieOption);
          res.status(200).json({
            success: true,
            message: "Logged Out"
          });
        } catch (error) {
          res.stats(400).json({
            success: false,
            message: error.message
          });
        }
      };

module.exports={
    signup,signin,getUser,logout
}