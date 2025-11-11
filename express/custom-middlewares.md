# Custom Middleware in Express.js

## 🧠 What Is Middleware?

A middleware in Express.js is simply a function that runs between the incoming request (`req`) and the outgoing response (`res`). It has access to the request, response, and the next middleware in the chain.

**Syntax:**

```javascript
function middlewareName(req, res, next) {
  // do something with req or res
  next(); // passes control to the next middleware
}
```

**Key:**
- `req` → HTTP request object
- `res` → HTTP response object
- `next()` → Function to move to the next middleware or route handler

## ⚙️ How Express Middleware Works

When a request comes in:

1. Express passes it through all middleware functions in the order they are declared.
2. Each middleware can:
   - Modify `req` or `res`
   - Log data
   - Perform validation or authentication
   - End the request/response cycle
   - Or pass control to the next middleware using `next()`

## 🧩 Your Example Explained

### 1️⃣ Middleware: `addNewTimeStamp`

```javascript
function addNewTimeStamp(req, res, next) {
  req.timeStamp = new Date().toISOString();
  next();
}
```

**Purpose:**
- Adds a new property `req.timeStamp` to every request.
- This property records the exact time the request reached the server.

**Why useful:**
- Helps in debugging and logging.
- Useful for analytics (e.g., tracking request times or performance).

### 2️⃣ Middleware: `requestLogger`

```javascript
function requestLogger(req, res, next) {
  const timeStamp = req.timeStamp;
  const method = req.method;
  const url = req.url;
  const userAgent = req.get("User-Agent");

  console.log(`[${timeStamp}] | ${method} | ${url} | ${userAgent}`);
  next();
}
```

**Purpose:** Logs important details about each request:
- 🕓 Timestamp (from previous middleware)
- 🧭 Method (GET, POST, PUT, etc.)
- 🌐 URL path
- 💻 User-Agent (browser or client type)

**Example Output:**

```
[2025-11-11T11:25:41.132Z] | GET | /api/users | Mozilla/5.0
```

**Why useful:**
- Great for debugging and monitoring incoming traffic.
- Acts like a simple "activity tracker" for your server.

### 3️⃣ Using Them in Express Globally

```javascript
app.use(addNewTimeStamp);
app.use(requestLogger);
```

- These middlewares are **global** — they apply to every route.
- The **order matters**:
  1. `addNewTimeStamp` runs first (so that `req.timeStamp` exists)
  2. `requestLogger` runs next (and logs using that timestamp)

If you reversed the order, the logger wouldn't find `req.timeStamp` yet.

## 🔄 Middleware Flow Example

```
Incoming request →
🧱 addNewTimeStamp → adds timestamp to req
⬇️
🧱 requestLogger → logs method, URL, user-agent, timestamp
⬇️
🏁 Route Handler → processes and sends response
```

So the data flows step by step through each layer.

## 🔍 Common Types of Custom Middleware

| Type | Example | Purpose |
|------|---------|---------|
| 🧾 Logger | Logs request info | Debugging & monitoring |
| ⏰ Timestamp | Adds time info | Tracking performance |
| 🔐 Auth | Checks JWT/token | Protect routes |
| ⚙️ Data Parser | Parses headers/body | Prepares data for routes |
| 🧠 Validator | Checks input fields | Request validation |
| 🧰 Error Handler | Catches errors | Sends proper responses |

## 🧩 Key Rules of Middleware

1. **Order matters**: Middleware runs in the order you define them with `app.use()` or route handlers.
2. **Always call `next()`** (unless sending a response): Without it, the request will hang — no response will be sent.
3. **Global vs. Route-specific**:
   - `app.use(middleware)` → applies to all routes.
   - `app.get('/route', middleware, handler)` → applies only to that route.
4. **You can modify `req` or `res`**:
   - Add new properties.
   - Attach tokens, user info, etc.

## ✅ Example Combined Flow

```javascript
const express = require("express");
const { requestLogger, addNewTimeStamp } = require("./middlewares");

const app = express();

// Global middlewares
app.use(addNewTimeStamp);
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send(`Hello! Request came at ${req.timeStamp}`);
});

app.listen(5000, () => console.log("Server running on port 5000"));
```

**Output:**

```
[2025-11-11T11:25:41.132Z] | GET | / | Mozilla/5.0
```

and browser shows:

```
Hello! Request came at 2025-11-11T11:25:41.132Z
```
