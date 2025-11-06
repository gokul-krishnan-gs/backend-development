# 📚 Bookstore API - Complete Guide

## 🎯 1. What You Built

A Bookstore API that allows:

- Adding new books 📗
- Viewing all books 📚
- Viewing a single book by ID 🔍
- Updating book details ✏️
- Deleting books ❌

**Technology Stack:**
- **Express.js** → Server & Routing
- **Mongoose** → MongoDB connection and data modeling
- **dotenv** → Environment variables
- **MVC Pattern** → Folder structure (Model, View, Controller)

---

## 🧩 2. Project Folder Structure

```
bookstore-api/
│
├── controllers/
│   └── book-controller.js     # Logic for CRUD operations
│
├── models/
│   └── Book.js                # Mongoose Schema & Model
│
├── routes/
│   └── book-routes.js         # API route definitions
│
├── database/
│   └── db.js                  # MongoDB connection setup
│
├── .env                       # Environment variables (PORT, etc.)
├── server.js / app.js         # Entry point of the app
└── package.json
```

**🧠 Why structure matters:**  
It makes your app scalable, organized, and readable for teams or future versions.

---

## ⚙️ 3. Server Setup (server.js)

```javascript
require('dotenv').config();
const express = require("express");
const connectToDb = require('./database/db.js');
const bookRoutes = require('./routes/book-routes.js');

const app = express();
const PORT = process.env.PORT;

// Database connection
connectToDb();

// Middleware
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening @localhost:${PORT} 👀🔥`);
});
```

**✨ Key Concepts:**

- **dotenv**: Loads variables from `.env` → `process.env.PORT`
- **express.json()**: Middleware that parses incoming JSON body
- **app.use()**: Registers middleware or routes
- **connectToDb()**: Handles DB connection
- **app.listen()**: Starts the server on the given port

---

## 🌿 4. Database Connection (database/db.js)

```javascript
const mongoose = require('mongoose');

async function connectToDb() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/bookstore');
    console.log("MongoDB 🍀 connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error);
    process.exit(1); // Stop server if DB fails
  }
}

module.exports = connectToDb;
```

**🧠 Notes:**

- Always use `try...catch` for DB connections
- `process.exit(1)` stops the server on DB failure
- Use `mongodb://127.0.0.1:27017/<dbname>` for local connection
- Use Atlas URI for cloud connection

---

## 📘 5. Book Model (models/Book.js)

```javascript
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxLength: [100, 'Book title cannot exceed 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Publication year is required'],
    min: [1000, 'Year must be at least 1000'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', bookSchema);
```

**✨ Notes:**

- **Schema**: Defines structure and validation rules for documents
- **Model**: Converts schema into a MongoDB collection
- **Validation**: Prevents invalid data (e.g., title required, year limit)
- **Defaults**: Automatically set fields like `createdAt`

---

## 🧠 6. Routing (routes/book-routes.js)

```javascript
const express = require('express');
const {
  getAllBooks,
  getSingleBookById,
  addNewBook,
  updateSingleBook,
  deleteSingleBook
} = require('../controllers/book-controller.js');

const router = express.Router();

router.get('/get', getAllBooks);
router.get('/get/:id', getSingleBookById);
router.post('/add', addNewBook);
router.put('/update/:id', updateSingleBook);
router.delete('/delete/:id', deleteSingleBook);

module.exports = router;
```

**🧭 Notes:**

- **Router**: Mini Express app that handles routes separately
- **Separation of concerns**: Keeps route definitions clean and readable
- Routes follow REST principles:
  - **GET** → Read
  - **POST** → Create
  - **PUT** → Update
  - **DELETE** → Delete

---

## ⚙️ 7. Controllers (controllers/book-controller.js)

Each controller contains business logic and interacts with the database.

### 🟢 GET All Books

```javascript
async function getAllBooks(req, res) {
  try {
    const books = await Book.find();
    if (books.length > 0) res.status(200).json(books);
    else res.status(404).json({ message: "No books found" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
```

### 🟢 GET Book by ID

```javascript
async function getSingleBookById(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
```

### 🟢 POST Add New Book

```javascript
async function addNewBook(req, res) {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: newBook
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
```

### 🟢 PUT Update Book

```javascript
async function updateSingleBook(req, res) {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedBook)
      return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
```

### 🟢 DELETE Book

```javascript
async function deleteSingleBook(req, res) {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook)
      return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ success: true, data: deletedBook });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
```

---

## 🧠 8. REST API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books/get` | Fetch all books |
| GET | `/api/books/get/:id` | Fetch one book by ID |
| POST | `/api/books/add` | Add a new book |
| PUT | `/api/books/update/:id` | Update a book |
| DELETE | `/api/books/delete/:id` | Delete a book |

---

## 🧱 9. Concepts You've Mastered

✅ Express.js fundamentals  
✅ REST API architecture  
✅ MVC structure (Model, Controller, Routes separation)  
✅ Mongoose schema, model & validation  
✅ CRUD operations with MongoDB  
✅ Environment variables (.env)  
✅ Async/await + try/catch for clean error handling  
✅ Middleware (express.json())  
✅ Status codes (200, 201, 404, 500)
