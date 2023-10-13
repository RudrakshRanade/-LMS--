const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
firstName : {
    type:String,
    required:true,
    trim:true
},

lastName : {
    type:String,
    required:true,
    trim:true
},

email : {
    type:String,
    required:true,
    trim:true
},

password : {
    type:String,
    required:true,
    trim:true
},

token : {
    type:String,
},

fine : {
    type : Number,
    default : 0,
},

books : [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Book",
}]

});


module.exports = mongoose.model( "User" , userSchema );