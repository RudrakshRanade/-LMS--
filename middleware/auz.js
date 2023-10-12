const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.auth = (req , res , next) =>{

    try{

    const token = req.cookies.Token || req.body.token || req.header("Authorization").replace( "Bearer " ,"" ) ;

    if( !token || token === undefined ){
        return res.status(401).json({
            success : false,
            message : "Token missing",  })
    }
    
    try{
        const decode = jwt.verify( token , process.env.JWT_SECRET ) ;
        req.user = decode;  } 
    
    catch(error){
        return res.status(401).json({
            success : false,
            message : "Invalid token",  })
    }
    
    next();  }
    
    catch(error){
        return res.status(401).json({
            success : false,
            message : "Authentication failed",  })
    }
    
    }
