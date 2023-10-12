const User = require("../model/User");
const Book_category = require("../model/Book_category");
const Book = require("../model/Book");

exports.getAllBooks = async( req , res ) => {

try{

    const response =await  Book_category.find();

    if( !response ){
        return res.status(404).json({
            success:false,
            message:"No books are available"
        })
    }

    return res.status(200).json({
        success:true,
        data:response,
        message:"All Books fetched successfully"
    })

}

catch(error){
  return res.status(400).json({
    success:false,
    data:{},
    message:"Cannot fetch Books ",
    err:error
  })
}


}



exports.getIssuedBooks = async( req , res ) => {

try{

const user_id = req.user.id;

console.log(user_id);

const user = await User.findById(user_id).populate("books");

if( !user ){
    return res.status(404).json({
        success:false,
        message:"User not found"
    })
}

const all_books = user.books;

return res.status(200).json({
    success:true,
    data:all_books,
    message:"Fetched Issued Books successfully"
})

}

catch(error){
    return res.status(400).json({
        success:false,
        data:{},
        message:"Cannot fetch Books ",
        err:error
      })

}

}


exports.getBookByName = async( req , res ) =>{

try{

    const{ name } = req.body;
   // const new_name=name.toLowerCase();

if( !name ){
    return res.status(404).json({
        success:false,
        message:"Please enter name"
    })

}

const books = await Book_category.find({name: name});

    if ( books.length === 0 ) {
      return res.status(404).json({ 
        success:false,
        message: 'Book not found' });
    }

    return res.status(200).json({
        success:true,
        data:books,
        message:"Fetched book successfully using name"
    })
    
}

catch(error){
    return res.status(400).json({
        success:false,
        data:{},
        message:"Cannot fetch Books ",
        err:error
      })

}

}


exports.issueBooksToUser = async (req, res) => {
    try {
      const { email, bookid1, bookid2, bookid3 , bookid4 , bookid5, issueDate, deadlineDate } = req.body;
  
      // Find the user by email
      const user = await User.findOne({email: email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      // Ensure that the user is not already at the maximum allowed books limit (e.g., 5)
      const bookIds = [bookid1, bookid2, bookid3, bookid4, bookid5].filter(Boolean); 
      // Filter out empty book IDs
      console.log(bookIds)
      
      if ( user.books.length + bookIds.length > 5 ) {
        return res.status(400).json({
          success: false,
          message: 'User has already reached the maximum book limit'   });
      }
  
      // Find the books to be issued
      const booksToIssue = await Book.find({ book_id: { $in: bookIds } });
      
      console.log( booksToIssue );

      // Check if all books exist and are available
      if ( booksToIssue.length !== bookIds.length ) {
        return res.status(404).json({
          success: false,
          message: 'One or more books not found',
        });
      }
  
      // Update user's issued books
      booksToIssue.forEach(fun3);
      
// var arr ;

      async function fun3(item){
        var result = item._id;
        console.log( "result" , result);
        console.log("before");

 

        console.log("After");
        // const str = result.toString();
        // arr.push(str); 
        user.books = user.books.concat(result);
      }

      await user.save();


      booksToIssue.forEach(fun);

      async function fun(item){
        
        const mainModel = await Book_category.findOne({ books: item._id });
        // Query for MainModel where the books array contains the given book ID;
      
      console.log(mainModel);

        if(mainModel){
          
          console.log(mainModel._id);

        const mybook = await Book_category.findById(mainModel._id);

        console.log(mybook);

        mybook.available -= 1;
         await mybook.save();  }

      }
        
      bookIds.forEach(fun2);
      async function fun2(item){
        const book = await Book.findOne({book_id : item});
        book.issue_date=issueDate;
        book.deadline=deadlineDate;
        await book.save();  
      }
    
    return res.status(200).json({
        success: true,
        message: 'Books issued successfully'  });

}

catch (error) {
      console.error(error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

  };


exports.reIssue = async( req,res ) => {
    
try{
  const {bookId} = req.body;


const book_detail = await Book.findById(bookId);


if( !book_detail ){
    return res.status().json({
        success:false,
        message:"Book not found"
    })
}

if( book_detail.count > 1 ){
    return res.status(400).json({
        success:false,
        message:"Cannot reissue book more than twice"
    })
}


book_detail.count += 1;
book_detail.issue_date = Date.now();
await book_detail.save();

return res.status(200).json({
    success:true,
    message:"Reissued book successfully"
});
}

catch(error){
    return res.status(500).json({
        success:false,
        message:"Something went wrong.Please try again later!"  })   
}

}


exports.returnBook = async ( req , res ) => {

try{

  const{ userid , bookid1 , bookid2 , bookid3 , bookid4 , bookid5 } = req.body;
  
  const bookIds = [bookid1, bookid2, bookid3, bookid4, bookid5].filter(Boolean);

  if( !userid || bookIds.length === 0 ){

return res.status(404).json({
  success:false,
  message:"Required entries must"  })

  }

  const user = await User.findOne({ email : userid });

if( !user ){
  return res.status(404).json({
    success:false,
    message:"User does not exist"  })
}

bookIds.forEach(fun2);
async function fun2(book_id)
 {
  
if(user.books.includes(book_id)){
  user.books.pull(book_id);

  const Book_cat = await Book_category.findOne({books: book_id }).exec();
  Book_cat.available += 1;
  await Book_cat.save();}

else{
  return res.status(404).json({
    success:false,
    message:"Use has not issued  the book"  })
}
  
return res.status(200).json({
  success:true,
  message:"Books returned successfully"  })

};
  
}

catch(error){
    return res.status(500).json({
      success:false,
      message:"Return failed!" })
}

}


exports.EmptyBooks = async(req,res)=>{
  try{
  const mybooks = await Book_category.find({available:0});
  return res.status(200).json({
    success:true,
    data:mybooks,
    message:"Successfully fetched all unavailable books"
  })
  }catch(error){
    return res.status(404).json({
      success:false,
      message:"Internal server error"
    })
  }
}