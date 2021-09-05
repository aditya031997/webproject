const mongoose =  require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
    FirstName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    Phone:{
        type:String,
        required:true,
        unique:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String
    },
    Password:{
        type:String,
        required:true
    },
    ConfirmPassword:{
        type:String,
        required:true
    },

    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id)
        const token = jwt.sign({_id:this._id.toString()},"mynameisadityakumarsinghiamfromphagwara");
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
       // console.log(token)
    }catch(error){
        res.send(error)
        console.log(error)
    }
}
    employeeSchema.pre("save", async function(next){
     if(this.isModified("Password")){
//const  PasswordHash = await bcypt.hash(Password, 10)
      console.log(`the password is ${this.Password}`)
      this.Password = await bcrypt.hash(this.Password, 10);
      console.log(`the password is ${this.Password}`);
      this.ConfirmPassword = await bcrypt.hash(this.ConfirmPassword, 10); 
     }   
      next();
      })
// create collection
const Register = new mongoose.model("Register", employeeSchema);
module.exports = Register;