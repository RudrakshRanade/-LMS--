const User=require('../model/User');
const Book=require("../model/Book")
const Book_Category = require("../model/Book_category");
const QrCodeData=require('../model/qrcode_Model');
const qr=require('qrcode');


const generateQRCodeDataURL = async (userId, bookId) => {

    const qrData = JSON.stringify({ userId, bookId });
  
    try {
      const qrDataURL = await qr.toDataURL(qrData);
      return qrDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };
  
exports.generates = async(req,res)=>{

    const userId = req.user.id;
   //console.log(userId);
    const { bookId } = req.body;

    //console.log(bookId);

    try{
    if(!bookId || !userId){
        return res.status(404).json({
            success:false,
            message:"All field must be filled"
        });
    }

    let qrCodeData = await QrCodeData.findOne({ userId:userId,bookId:bookId });
//console.log(qrCodeData);
    // If data exists, update the existing document with new data
    if (qrCodeData) {
      //console.log("hello");
      qrCodeData.userId = userId;
      qrCodeData.bookId = bookId;
      qrCodeData.qrDataURL = await generateQRCodeDataURL(userId, bookId);
    } else {
      // Generate a new QR code and create a new document
      const qrDataURL = await generateQRCodeDataURL(userId, bookId);
      //console.log(qrDataURL);

      const str = qrDataURL.slice(22);

    let response= new QrCodeData ({
      userId:userId,
      bookId:bookId,
      qrUrl:str
    });
    
    
//console.log( typeof(qrDataURL) );

      await response.save();
    }

    // Return the generated QR code URL to the frontend
    res.status(200).json({ message: 'QR code data stored or updated successfully', qrDataURL: qrCodeData.qrDataURL });
  } 
  
catch (err) {
    res.status(500).json({ error: err.message });
  }

    }


exports.scan = async(req,res)=>{
        // const data = JSON.parse(req.body);
        const{ bookId , userId } = req.body;
        //verify token
      //  const {bookId,userId}=data;
        if(!bookId || !userId){
          return res.status(404).json({
              success:false,
              message:"All field must be filled"  });
      }
      try {
        // Check if the QR code data with the provided userId and bookId exists
        const qrCodeData = await QrCodeData.findOne({userId:userId, bookId:bookId });
    
//console.log(qrCodeData);

        if (!qrCodeData) {
          return res.status(404).json({ error: 'QR code data not found' });
        }
        const myBook = await Book.findOne({book_id:bookId});
        if(!myBook){
          return res.status(404).json({ error: 'Book not found' });
        }
        if(!myBook.issue_date){
          return res.status(400).json({ error: 'Book is not currently issued' });
       }


        const response = await Book.findOne({book_id : bookId});;
        const Book_cat = await Book_Category.findOne({books : response._id }).exec();
        Book_cat.available+=1;
        await Book_cat.save();
        const user = await User.findById(userId).populate("books");

// console.log(response._id);
// console.log(user);

var date2 = new Date(); 
var ddate = myBook.deadline;

if( date2 > ddate ){

  const diffTime = date2 - ddate;
 
  const daysDifference = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  user.fine += (daysDifference*10); 
  
  await user.save();  }

        //Retun 
      myBook.issue_date=null;
      myBook.deadline=null;

await myBook.save();

        user.books.pull(response._id);
        await user.save();
        
        return res.status(200).json({
          success:true,
          message:"Return the book successfully"  });
  
    }
    
catch(error){

  console.log(error.message);
  
      return res.status(500).json({
        success:false,
        message:"Was not able to return the book"  });
    }

  }

