const mongoose = require('mongoose');

const QrSchema = new mongoose.Schema({

  userId:{
    type:  mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  
  bookId:{
    type: String,
    required:true
  },

  qrUrl:{
    type:String,
    required:true,
    // unique:true
  },

  createdAt:{
    type:Date,
    default:new Date(),
    expires: 60*10,
  }
  
});

const QrCodeData = mongoose.model('QrCodeData', QrSchema);

module.exports =QrCodeData;
