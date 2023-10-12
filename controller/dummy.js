const User=require('../model/User');
const Book=require("../model/Book")
const Book_Category = require("../model/Book_category");

exports.issueBooks = async (req, res) => {
    //const { userId } = req.user; // Assuming you have middleware to get the user from the token
    //let { bookIds } = req.body;
    const { email, bookid1, bookid2, bookid3 , bookid4 , bookid5, issueDate, deadlineDate } = req.body;
    const user2 = await User.findOne({email: email });
    // Filter out empty or null values
    if (!user2) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      const bookIds = [bookid1, bookid2, bookid3, bookid4, bookid5].filter(Boolean);
    //bookIds = bookIds.filter(Boolean);
  
    try {
      const user = await User.findById(user2._id).populate('books');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Check the maximum limit for issuing books
      if (user.issuedBooks.length + bookIds.length > 5) {
        return res.status(400).json({
          success: false,
          message: "You cannot exceed the maximum limit for issued books.",
        });
      }
  
      for (const bookId of bookIds) {
        // Find the book
        const book = await Book.findOne({ book_id: bookId });
  
        if (book) {
          // Update book's issued date and deadline
          book.issue_date = issueDate;
          //const deadline = deadlineDate;
          //deadline.setDate(deadline.getDate() + 30);
          book.deadline = deadlineDate;
  
          // Add the book to the user's issuedBooks array
          user.issuedBooks.push(book._id);
  
          // Update the available count in Book_category
          const bookCategory = await Book_Category.findOne({ _id: book._id });
          if (bookCategory) {
            bookCategory.available=bookCategory.available-bookIds.length;
            await bookCategory.save();
          }
        }
      }
  
      // Save the updated user
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "Books issued successfully.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while issuing books.",
      });
    }
  };
  