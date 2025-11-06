//load .env file content to process.env
require('dotenv').config();



const express  = require("express");

const app = express();

const PORT = process.env.PORT;

const connectToDb = require('./database/db.js');

const bookRoutes = require('./routes/book-routes.js');

//database connection
connectToDb();

//middleware

app.use(express.json());


//routes
app.use('/api/books',bookRoutes);

app.listen(PORT,()=>{
    console.log(`Server is listeneing @localhost:${PORT}👀🔥`);
})
