const mongoose = require("mongoose");

const book = new mongoose.Schema({
    
book_id : {
    type:String,
    required:true,
    trim:true
},

condition : {
    type:String,
    required:true,
    trim:true
},

count : {
    type : Number,
    default : 0,
},

issue_date : {
    type:Date,
    default : null,
},

deadline : {
    type:Date,
    default : null,
},

category_id : {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Book_category"  
}

});


module.exports = mongoose.model( "Book" , book );