const jwt = require("jsonwebtoken");
const Register = require("../models/register");


const auth = async(req,res,next)=>{
    try{
     const token =  req.cookies.jwt;
     const verifyUser = jwt.verify(token, "mynameisadityakumarsinghiamfromphagwara");
     console.log(verifyUser);

     const user = await Register.findOne({_id:verifyUser._id});
     console.log(user.FirstName);
     next();


    }catch(error){
        res.status(401).send(error); 
    }
}

module.exports = auth;