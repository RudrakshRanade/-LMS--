const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auz");


// *****************************************************************************************************************

//                                           Admin Routes 

//*******************************************************************************************************************

const { createBook , createBookCategory , deleteBookCategory , deleteBook , updateBook , updateBookCategory, adminLogin } = require("../controller/admin");

router.post( '/createbook' , createBook );
router.post( '/createbookcategory' , createBookCategory );
router.delete( '/deletebookcategory' , deleteBookCategory );
router.delete( '/deletebook' , deleteBook );
router.put( '/updatebook' , updateBook );
router.put( '/updatebookcategory' , updateBookCategory );
router.get( '/adminlogin' , adminLogin );


// *****************************************************************************************************************

//                                           Auth Routes 

//*******************************************************************************************************************


const{ signup , login , sendOtp } = require("../controller/Auth");

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/sendotp" , sendOtp); 


// *****************************************************************************************************************

//                                           QR  Routes 

//*******************************************************************************************************************


const{ generates , scan} = require("../controller/qrCode");

router.post("/generateQr", auth , generates);
router.post("/Qrreturn" , scan);


// *****************************************************************************************************************

//                                           User Routes 

//*******************************************************************************************************************


const { update_user } = require("../controller/user");

router.put( '/update_user' , auth , update_user );


// *****************************************************************************************************************

//                                           Book Routes 

//*******************************************************************************************************************

const{ getAllBooks , getIssuedBooks , issueBooksToUser , getBookByName , reIssue, returnBook , EmptyBooks } = require("../controller/book");

router.get( '/getallbooks' ,getAllBooks );
router.get( '/getissuedbooks' , auth ,getIssuedBooks );
router.post( '/issuebook' , issueBooksToUser );
router.get( '/getbookbyname' ,getBookByName );
router.put( '/reissue' , reIssue );
router.get( '/returnBook' , returnBook );
router.get('/getunavailablebooks' , EmptyBooks );

module.exports=router;