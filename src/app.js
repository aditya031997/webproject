require('dotenv').config()
const express=require("express");
const app= express();
require('./db/conn')
const Register = require("./models/register")
const path =require('path')
const hbs = require("hbs")
const cookieParser = require("cookie-parser")
const auth = require('./midelware/auth')
//const jwt = require("jsonwebtoken");
const port= process.env.PORT || 3000;
const bcrypt = require("bcryptjs")

const static_path=path.join(__dirname,"../public")
const template_path=path.join(__dirname,"../template/views")
const partials_path=path.join(__dirname,"../template/partials")

//console.log(path.join(__dirname,"../public"))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path))
app.set("view engine","hbs");
app.set("views",template_path)
hbs.registerPartials(partials_path)

//console.log(process.env.Secret_key)
app.get("/", (req,res)=>{
    res.render("index")
});

app.get("/Register",(req,res)=>{
    res.render("Register");
});

app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/Secret", auth ,(req,res)=>{
    //console.log(`the cookies is ${req.cookies.jwt}`)
    res.render("Secret");
});

app.post("/Register", async(req,res)=>{
    try {
        // console.log(req.body.FirstName);
        // res.status(400).send(req.body.FirstName);
        const Password= req.body.Password;
        const ConfirmPassword= req.body.ConfirmPassword;

        if(Password === ConfirmPassword){
            const registerEmployee = new Register({
                FirstName : req.body.FirstName,
                LastName : req.body.LastName,
                Phone : req.body.Phone,
                Age : req.body.Age,
                Address:req.body.Address,
                Email : req.body.Email,
                gender : req.body.gender,
                Password : Password,
                ConfirmPassword: ConfirmPassword
            })

            console.log(registerEmployee);
            // generate token
            const token = await registerEmployee.generateAuthToken();
            console.log(token);
            res.cookie("jwt", token,{
                expires: new Date(Date.now()+ 50000),
                httpOnly:true
            });
            console.log(cookie)

            const registerd = await registerEmployee.save();
            res.status(201).render("index");
        }else {
            res.send(" data not matching")
        }
    }catch (error){
        res.status(400).send(error);
    }
});



app.post("/login",async(req,res)=>{
    try{
        const Email = req.body.Email;
        const Password = req.body.Password;

        const useremail = await Register.findOne({Email:Email})
        const isMatch = await bcrypt.compare(Password,useremail.Password);

        const token = await useremail.generateAuthToken();
        console.log(token);

        res.cookie("jwt", token,{
            expires: new Date(Date.now()+ 50000),
            httpOnly:true
        });

        

        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send("invalid details")
        }
            
        
    }catch(error){
        res.status(400).send(error);
    }
})

app.listen(port,()=>{
    console.log(`server is running on port no ${port}`)
})