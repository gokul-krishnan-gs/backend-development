const express = require('express');
const { getAllBooks,getSingleBookById,addNewBook,updateSingleBook,deleteSingleBook} = require('../controllers/book-controller.js');

//create express router
const router = express.Router();

//routes
router.get('/get',getAllBooks);
router.get('/get/:id',getSingleBookById);
router.post('/add',addNewBook);
router.put('/update/:id',updateSingleBook)
router.delete('/delete/:id',deleteSingleBook);

module.exports = router;

