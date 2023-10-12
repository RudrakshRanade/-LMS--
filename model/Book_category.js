const mongoose = require("mongoose");

const Book_category = new mongoose.Schema({
    
name : {
    type:String,
    required:true,
    trim:true
},

author : {
    type:String,
    required:true,
    trim:true
},

price : {
    type:Number,
    required:true,
    trim:true
},

pages : {
    type:Number,
    required:true,
},

available : {
    type:Number,
    default:0,
    trim:true
},


total : {
    type:Number,
    default:0,
    trim:true
},

description : {
    type:String,
    required:true,
    trim:true
},

books : [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Book"
}],


});


module.exports = mongoose.model( "Book_category" , Book_category );