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
router.post( '/adminlogin' , adminLogin );


// *****************************************************************************************************************

//                                           Auth Routes 

//*******************************************************************************************************************


const{ signup , login , sendOtp } = require("../controller/auth");

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/sendotp" , sendOtp); 


// *****************************************************************************************************************

//                                           QR  Routes 

//*******************************************************************************************************************


const{ generates , scan} = require("../controller/qrCode");

router.post("/generateqr", auth , generates);
router.post("/scanqr" , scan);


// *****************************************************************************************************************

//                                           User Routes 

//*******************************************************************************************************************


const { update_user , getFine } = require("../controller/user");

router.put( '/updateuser' , auth , update_user );
router.get( '/getfine' , auth , getFine);


// *****************************************************************************************************************

//                                           Book Routes 

//*******************************************************************************************************************

const{ getAllBooks , getIssuedBooks , issueBooksToUser , getBookByName ,
     reIssue, returnBook , EmptyBooks , requestbook } = require("../controller/book");

router.get( '/getallbooks' ,getAllBooks );
router.get( '/getissuedbooks' , auth ,getIssuedBooks );
router.post( '/issuebook' , issueBooksToUser );
router.get( '/getbookbyname' ,getBookByName );
router.put( '/reissue' , auth , reIssue );
router.get( '/returnBook' , returnBook );
router.get('/getunavailablebooks' , EmptyBooks );
router.post('/requestbook' , requestbook );

module.exports=router;