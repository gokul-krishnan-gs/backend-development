# 🧠 Winston Logger Integration in Express.js

A simple yet powerful demonstration of how to implement Winston logging in an Express.js application. This project shows how to log info, error, and debug level messages to both the console and log files, using the popular Winston library.

## 🚀 Features

* 📦 Built with Node.js and Express.js
* 🪵 Integrated Winston for structured logging
* 🧩 Custom log levels for better debugging (`info`, `error`, `debug`)
* 🗂 Logs stored in files:
   * `combined.log` → all logs
   * `error.log` → only error logs
* 🖥 Colorized console output for easy local development
* ⚙️ Environment-aware log level control (`development` / `production`)

## 🏗️ Project Structure

```
winston-usecase/
├── app.js             # Main Express server
├── logger.js          # Winston logger configuration
├── .env               # Environment variables (PORT, NODE_ENV)
├── package.json       # Dependencies and scripts
├── combined.log       # All logs (auto-generated)
├── error.log          # Error logs (auto-generated)
└── README.md
```

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/winston-usecase.git
cd winston-usecase
```

### 2️⃣ Install Dependencies

```bash
npm install express nodemon dotenv winston
```

### 3️⃣ Create a `.env` File

```
PORT=3000
NODE_ENV=development
```

### 4️⃣ Run the App

For development (auto-restart with nodemon):

```bash
npm run dev
```

For production:

```bash
npm start
```

## 🧩 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Logs an info message and returns a welcome message |
| GET | `/error` | Simulates an error and logs it using `logger.error()` |

## 🪶 Sample Logs

### 📘 Console Output (Development Mode)

```
info: Server is starting...
info: Server running on http://localhost:3000
info: Home route accessed
error: Error occurred: Something went wrong!
```

### 📁 File Output

**combined.log**

```json
{"level":"info","message":"Server is starting...","timestamp":"2025-11-13T06:30:00.000Z"}
{"level":"info","message":"Home route accessed","timestamp":"2025-11-13T06:31:00.000Z"}
```

**error.log**

```json
{"level":"error","message":"Error occurred: Something went wrong!","timestamp":"2025-11-13T06:31:05.000Z"}
```

## 🧠 Learning Takeaway

This mini-project demonstrates how to:

* ✅ Implement Winston for professional logging
* ✅ Log different levels of information
* ✅ Separate error and general logs
* ✅ Prepare for scalable, production-ready applications

## 🧑‍💻 Author

**Gokul Krishnan**

💼 Aspiring Software Engineer | 🧩 Passionate about Backend 

## 📜 License

This project is licensed under the MIT License – feel free to use and modify it.
