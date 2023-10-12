const mongoose = require("mongoose");

const admin = new mongoose.Schema({
    
ID : {
    type:Number,
    required:true,
    trim:true
},

key : {
    type:String,
    required:true,
    trim:true
},


});


module.exports = mongoose.model( "Admin" , admin );