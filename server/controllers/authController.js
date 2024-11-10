
const JWT = require("jsonwebtoken")
const User = require('../models/user.model')
const bcrypt = require('bcrypt');
require("dotenv").config();


// Register
const userRegister = async (req,res)=>{

    const {username, email, password} = req.body

    try {
        const userEmail = await User.findOne({email})

        if(userEmail){
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            })
         }

         //  hashing password
        let salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);

         // create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            success:true,
            message:"successfully Registered",
            newUser
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Register API",
            error,
          });
    }
}

// Login
const userLogin = async (req, res)=>{
    const {email, password} = req.body

    try {

        // Check user
        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
            success: false,
            message: "Invalid Email",
            })
        }
        
        // Check user password || compare password 
         const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch ){
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            })
        }

        // token
        const accessToken = JWT.sign({user},
            process.env.JWT_SECRET,{
                expiresIn : '1h'
            }
        )

        // Send token in an HTTP-only cookie
        res.cookie("token", accessToken, {
            httpOnly: true, 
            // maxAge: 60 * 60 * 1000, 
            // sameSite: 'Strict'
        }).status(200).json({
            accessToken, 
            message: "Login successfull"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in login API",
            error
        });
    }
}

// Logout
const userLogout = async (req, res) => {
    res.clearCookie('token'); 
    res.status(200).json('Logged out successfully');
  }


module.exports = {userRegister, userLogin, userLogout}





