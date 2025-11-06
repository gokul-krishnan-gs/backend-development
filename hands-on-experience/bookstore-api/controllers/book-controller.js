const Book = require("../models/Book.js");

async function getAllBooks(req,res){
    try{

        const getAllBooksData = await Book.find();
        if(getAllBooksData.length > 0)
            res.status(200).json(getAllBooksData);
        else{
            res.status(404).json({
                message: "No books found in database"
            });
        }

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        });
    }

}

async function getSingleBookById(req,res){
    try{
        const bookId = req.params.id;
        const bookDetailsById = await Book.findById(bookId);
        if(!bookDetailsById){
            return res.status(404).json({
                success: false,
                message: "Book with the current ID is not present"
            });
        }
        res.status(200).json(bookDetailsById);
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again!"
     });
    }
}

async function addNewBook(req,res){
   try{
       const newBookFromData = req.body;
       const newlyCreatedBook = await Book.create(newBookFromData);
      if(newlyCreatedBook){
        res.status(201).json({
            success: true,
            message: "Book Added Successfully",
            data: newlyCreatedBook
        });
      }
   }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again!"
     });
   }
}

async function updateSingleBook(req,res){
    try{
       const updateBookFromData = req.body;
        const bookId = req.params.id;
        const updatedBook = await Book.findByIdAndUpdate(bookId,updateBookFromData,{
            new: true
        });

        if(!updatedBook){
        return res.status(404).json({
                success: false,
                message: "Book with the current ID is not present"
            });       
        }

        res.status(200).json({
            success: true,
            data: updatedBook
        });
    }catch(error){
         console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again!"
     });         
    }
}

async function deleteSingleBook(req,res){
    try{
        const bookId = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if(!deletedBook){
            return res.status(404).json({
                success: false,
                message: "Book is not present"
            });
        }
        res.status(200).json({
            success: true,
            data: deletedBook
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again!"
     });        
    }

}

module.exports = { 
    getAllBooks , 
    getSingleBookById, 
    addNewBook,
    updateSingleBook,
    deleteSingleBook
}