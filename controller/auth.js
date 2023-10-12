const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../model/Otp");
const otpGenerator = require("otp-generator");
const User = require("../model/User");

exports.signup = async (req, res) => {
    try {
      const { firstName, lastName, email, password, otp } = req.body;
  
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }
  
      const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
      console.log(response);
      if (response.length === 0) {
          // OTP not found for the email
          return res.status(400).json({
              success: false,
              message: "OTP is not found",
          });
      } 
      else if (otp !== response[0].otp) {
          //
          return res.status(400).json({
              success: false,
              message: "OTP is not valid",
          });
      }
  
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Error in hashing password",
        });
      }
  
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
       
      });
  
      console.log(user);
      return res.status(200).json({
        success: true,
        message: "User created successfully",
      });
  
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "Signup failed!!!",
      });
    }
  };
  

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User is not registered",
        });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      if (isPasswordMatch) {
        const token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );
  
        user.token = token;
        user.password = undefined;
  
        const options = {
          httpOnly: true,
        };
  
        res.cookie("Token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "User logged in successfully",  });
  
          } else {
        return res.status(403).json({
          success: false,
          message: "Password does not match",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Login Failure. Please Try Again",
      });
    }
  };
  
  exports.sendOtp = async (req, res) => { 
  
        try {
  
          const {email} = req.body;     
  
          const user = User.findOne({email});
            if(!user){
              return res.status(400).json({
                success:false,
                message:"User already exists"  })
            }
           
  
        var otp = otpGenerator.generate(6, {
              upperCaseAlphabets: false,
              lowerCaseAlphabets: false,
              specialChars: false,
          });
  
             
      const otpDoc = await Otp.create({
              email,
              otp  })
                
                
            console.log(otpDoc);
  
          return res.status(200).json({
              success:true,
              message:"OTP sended successfully"  })
  
        } catch (error) {
          
              console.log(error.message);
              return res.status(500).json({
                  success:false,
                  message:"OTP cannot be sended"  })
  
        }
      
  }
  
  