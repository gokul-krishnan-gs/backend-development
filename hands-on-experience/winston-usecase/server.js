// app.js
require("dotenv").config();
const express = require("express");
const logger = require("./logger.js"); // import  Winston logger

const app = express();

//When server starts
logger.info("Server is starting...");


// Example route
app.get("/", (req, res) => {
  logger.info("Home route accessed");
  res.send("Welcome Gokul!");
});

// Simulate an error
app.get("/error", (req, res) => {
  try {
    throw new Error("Something went wrong!");
  } catch (err) {
    logger.error("Error occurred: %s", err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    //server running message
  logger.info(`Server running on http://localhost:${PORT}`);
});
