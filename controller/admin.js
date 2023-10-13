const Book = require('../model/Book');
const Book_category = require("../model/Book_category");
const Admin = require("../model/Admin");

exports.createBook = async ( req , res ) => {

try{

const { bookid , condition , category } = req.body;


if( !bookid || !condition || !category ){
    return res.status(404).json({
        success:false,
        message:"All fields are required"   })
}


const book_category = await Book_category.findOne({ name : category });

if( !book_category ){
    return res.status(404).json({
        success:false,
        message:"Book category not found"  })
}


const response = await Book.create({
    book_id : bookid,
    condition : condition,
    category_id : book_category._id,  });


if( !response ){
    return res.status(400).json({
        success:false,
        message:"Unable to add book"  })
}

 book_category.available += 1;
 book_category.total += 1;

book_category.books.push(response._id);

await book_category.save();

return res.status(200).json({
    success:true,
    message:"Book added successfully"  });

}

catch(error){

    console.log(error.message);

    return res.status(500).json({
        success:false,
        message:"cannot add book"  })
}

}


exports.createBookCategory = async (req, res) => {
    try {
      const { name, author, price, pages, description } = req.body;
  
      const response = await Book_category.create({
        name,
        author,
        price,
        pages,
        description,
      });
  
      if (!response) {
        return res.status(404).json({
          success: false,
          message: "Unable to add new category",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "New category added",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while adding a new category",
      });
    }
  };
  


exports.deleteBookCategory = async ( req , res ) => {

try{
    
const { name } = req.body;
    

const response = await Book_category.find({ name  : name }).populate('books');


if( response.books ){
    return res.status(400).json({
        success:false,
        message:"Cannot delete model with books inside"  })

}


const delete_res = await Book_category.deleteOne({ name  : name });

if( !delete_res ){
    return res.status(404).json({
        success:false,
        message:"Unable to delete category model"  })  
}

return res.status(200).json({
    success:true,
    message:"Category model deleted successfully"  })  

}
    
catch(error){
    return res.status(500).json({
        success:false,
        message:"Something went wrong while deleting category model"  })     
}
    
}

exports.deleteBook = async ( req , res ) => {

try{
    const{ bookid , category }=req.body;

        if( !bookid || !category ){
            return res.status().json({
                success:false,
                message:"All fields are required"  })
        }


    const book_category = await Book_category.findOne({ name: category }).populate('books');

    const myresponse=await Book.findOne({book_id:bookid});

console.log(myresponse._id);

    const idx = book_category.books.pull(myresponse._id);

    const response = await Book.deleteOne({ _id:myresponse._id });

    if( !response ){
        return res.status(402).json({
            success:false,
            message:"Unable to delete book"  })
    }

    book_category.total-=1;
    book_category.available-=1;
    await book_category.save();

    return res.status(200).json({
        success:true,
        message:"successfully deleted the book"
    })
 }
        
catch(error){

console.log(error.message);

        return res.status(500).json({
            success:false,
            message:"Was not able to delete the book"  })    
}
        
}

exports.updateBook = async ( req , res ) => {

try{
       const {bookid,condition}=req.body;
       
       if(!bookid || !condition){
        return res.status(404).json({
            success:false,
            message:"All fields required"  })
       }
      const response=await Book.findOne({book_id:bookid});
      console.log(response);
      if(!response){
        return res.status(404).json({
            success:false,
            message:"Unable to update update the book"
        });
    }

       const response2= await Book.findByIdAndUpdate(response._id,{condition:condition},{new:true});
       console.log(response2);
       if(!response2){
        return res.status(404).json({
            success:false,
            message:"Unable to update update the book"
        });
    }
    return res.status(200).json({
        success:true,
        message:"Successfully update a book"
    });
}
            
catch(error){

  console.log(error.message);

        return res.status(500).json({
            success:false,
            message:"Something went wrong while updating the book"
        });     
}
            
}


exports.updateBookCategory = async ( req , res ) => {

try{

const{ name , author , price , pages , description } = req.body;
    
const response = await Book_category.find({ name : name });

console.log(response);

if( !response ){
    return res.status(404).json({
        success:false,
        message:"Not able to update category model"   });     
}

const update_res = await Book_category.findOneAndUpdate({ name : name }, {
    author,
    price,
    pages,
    description
  }, { new: true });


if( !update_res ){
        return res.status(404).json({
            success:false,
            message:"Was Not able to update category model"   });     
    }

    console.log("hello");

    return res.status(200).json({
        success:true,
        message:"Category model updated successfully"   });  

}
                
catch(error){
    
    return res.status(500).json({
        success:false,
        message:"Something went wrong while updating the bookcategory"   });                   

}
}


//admin login 
exports.adminLogin = async (req, res) => {
    try {
      const { ID , key } = req.body;
  
      if (!ID || !key) {
        return res.status(404).json({ msg: "Please enter all fields" });
      }
  
      const admin = await Admin.findOne({ ID:ID });
  
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not Found",  });
      }
  
      // const isPasswordMatch = await bcrypt.compare( key , admin.key );
  
if( key == admin.key ){
  return res.status(200).json({
    success:true,  
    message:"Admin logged in successfully"  })
}

        return res.status(403).json({
          success: false,
          message: "Password does not match",  });
      
        }

catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Login Failure. Please Try Again",
      });
    }
  };