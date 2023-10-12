const mongoose = require("mongoose");
const mailsender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({ 

    email : {
       type : String,
       required : true
    },
 
    otp : {
       type : String,
       required : true
    },
 
    createdAt : { 
         type : Date,
         default : Date.now,
         expires : 60*5
    },
 
 })
 
 
 async function sendOtp(email , otp){ 
 
     try {
           
         const res = await mailsender(
 
          email,
          "Verification Email",
           `"Your OTP is ${otp}"`,
         );
 
         console.log(res);
         console.log("email sended successfully")
     } catch (error) {
    
         console.log(error.message)
         throw new Error("Email cannot be sended");
     }
 }
 
 otpSchema.pre("save" , async function(next){
        
 
 
     console.log("New doocument added");
 
 
        if(this.isNew){
         await sendOtp(this.email , this.otp);
        }
 
 
        next();
 
 })
 
 const Otp = mongoose.model("Otp" , otpSchema);
 
 module.exports = Otp;