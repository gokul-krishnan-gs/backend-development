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

---


# Express.js Custom Error Middleware

## 🧠 What is a Custom Error Middleware?

In Express.js, a custom error-handling middleware is a special function that catches and handles all errors that occur in your app — instead of letting your app crash or send confusing default errors.

It helps you:
* Handle errors in one central place (not in every route).
* Customize error messages sent to the client.
* Prevent the server from crashing.
* Maintain clean and readable code.

## ⚙️ Structure of Error Handling Middleware

An error-handling middleware has four parameters:

```javascript
function (err, req, res, next) {
   ...
}
```

Notice the first parameter `err` — Express treats any middleware with 4 parameters as an error handler.

## 🧩 Your Code Explained Step-by-Step

### 1. `APIError` Class

```javascript
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}
```

✅ This is a custom error class extending the built-in `Error`. You use it to create meaningful, structured errors.

For example:

```javascript
throw new APIError("Item not found", 404);
```

This is better than just `throw new Error("Something broke")` because it includes a status code and clear name.

### 2. `asyncHandler` Function

```javascript
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

✅ This is a wrapper to catch errors in `async` route handlers.

Without it:

```javascript
router.get("/items", async (req, res) => {
  const data = await getItems(); // if this throws error -> server crashes
});
```

With it:

```javascript
router.get("/items", asyncHandler(async (req, res) => {
  const data = await getItems();
  res.json(data);
}));
```

If any error occurs, `catch(next)` passes it to Express's error system → your global error handler handles it safely.

### 3. `globalErrorHandler` Function

```javascript
function globalErrorHandler(error, req, res, next) {
  console.error(error.stack);

  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      status: "Error",
      message: error.message
    });
  } else {
    return res.status(500).json({
      status: "Error",
      message: "Server Error"
    });
  }
}
```

✅ This function catches all errors in your app:
* If it's a known `APIError` → respond with the correct status code & message.
* Otherwise → send a general "Server Error" (safe for production).

You placed it at the very end of your middleware stack:

```javascript
app.use(globalErrorHandler);
```

That's correct — because Express passes errors down the chain, so the last middleware should handle them.

### 4. Example in Action

Route:

```javascript
router.get("/items", asyncHandler(async function(req, res) {
    throw new APIError("No items found", 404);
}));
```

Output:

```json
{
  "status": "Error",
  "message": "No items found"
}
```

## 🚀 Why We Need It

| Problem | Without Custom Handler | With Custom Handler |
|---------|------------------------|---------------------|
| Async function throws error | Server crashes | Error handled safely |
| Different error types | Hard to debug | Unified structure |
| Repeated try-catch everywhere | Messy code | Clean and centralized |
| Production-safe responses | Exposes stack trace | Controlled output |

## 🧩 Summary

| Concept | Purpose |
|---------|---------|
| `APIError` | Custom error object with message & status code |
| `asyncHandler()` | Catches async errors automatically |
| `globalErrorHandler()` | Centralized error catcher & responder |
| `app.use(globalErrorHandler)` | Ensures all errors are caught |


---

# 🧠 What is API Versioning?

API versioning means giving your API different versions (v1, v2, v3...) as it evolves over time.

When you update your backend API (like change routes, response structure, or logic), older apps or clients might still depend on the old version.

So, to avoid breaking those old clients, you keep multiple versions of your API running.

## 💡 Example

Let's say you built this API:

**Version 1:**

```
GET /api/v1/users
```

returns:

```json
{
  "name": "Gokul",
  "age": 22
}
```

Then later, you upgrade your app and change it to include `email` also.

**Version 2:**

```
GET /api/v2/users
```

returns:

```json
{
  "fullName": "Gokul Krishnan",
  "age": 22,
  "email": "gokul@example.com"
}
```

Now:
* Old users using `/api/v1/users` still work fine ✅
* New users can use `/api/v2/users` ✅ 

No one breaks.

## 🎯 Why We Need API Versioning

| Reason | Explanation |
|--------|-------------|
| 🛠 Maintain Backward Compatibility | Older apps still work even if the API changes |
| ⚡ Safe Upgrades | You can introduce new features or fields without breaking existing systems |
| 💬 Clear Communication | Developers know which API version they're working with |
| 🧩 Better API Lifecycle Management | You can deprecate (slowly remove) older versions step-by-step |

## ⚙️ Ways to Implement API Versioning

There are several strategies — and your code shows three of them 👇

### 1. URL Versioning (most common)

```javascript
app.use(urlVersioning("v1"));
```

Example request:

```
GET /api/v1/products
```

Middleware logic:

```javascript
if (req.path.startsWith(`/api/${version}`)) {
   next(); // allowed
} else {
   res.status(404).json({ error: "API version not found" });
}
```

✅ **Pros:**
* Very clear and easy to use.
* Version visible in URL.

❌ **Cons:**
* Changes the URL structure.

### 2. Header Versioning

```javascript
app.use(headerVersioning("v1"));
```

Example request:

```
GET /products
Accept-Version: v1
```

Middleware logic:

```javascript
if (req.get('Accept-Version') === version) next();
else res.status(404).json({ error: "API version not found" });
```

✅ **Pros:**
* Cleaner URLs.
* Good for APIs that follow strict REST design.

❌ **Cons:**
* Slightly harder for frontend devs to remember to add headers.

### 3. Content-Type Versioning

```javascript
app.use(contentTypeVersioning("v1"));
```

Example request header:

```
Content-Type: application/vnd.api.v1+json
```

Middleware logic:

```javascript
if (contentType.includes(`application/vnd.api.${version}+json`)) next();
else res.status(404).json({ error: "API version not found" });
```

✅ **Pros:**
* Used by large companies (like GitHub API).
* Very flexible for API evolution.

❌ **Cons:**
* More advanced — not beginner-friendly.

## 🚀 Real-World Analogy

Think of API versioning like mobile app versions:
* Android App v1.0 → works fine on old phones.
* Android App v2.0 → has new features, but still supports old users.

Same way, your backend API keeps multiple versions running until old users upgrade.

## 🧩 Summary

| Concept | Meaning |
|---------|---------|
| API Versioning | Keeping multiple API versions to support old and new clients |
| urlVersioning | Version inside the URL (`/api/v1/...`) |
| headerVersioning | Version in HTTP Header (`Accept-Version: v1`) |
| contentTypeVersioning | Version in Content-Type (`application/vnd.api.v1+json`) |
| Need | To prevent breaking old apps after API updates |

✅ **In short:**

API versioning = "Keep old clients happy while adding new features safely."

---

# 🧠 What is Rate Limiting?

Rate Limiting means restricting how many requests a user (or IP address) can make to your API within a specific time period.

It's like putting a speed limit on a highway:

You can drive fast, but not too fast, or you'll get stopped 🚓

In backend terms:

A user can make only a certain number of API requests in a time window — beyond that, the server temporarily blocks them.

## 🎯 Why We Need Rate Limiting

Here's why this concept is so important 👇

| Reason | Explanation |
|--------|-------------|
| 🛡 Prevent DDoS Attacks | Attackers send thousands of requests per second to crash your server. Rate limiting protects against that. |
| ⚙️ Save Server Resources | Prevents one user from overloading your backend (CPU, DB, bandwidth). |
| 👥 Fair Usage | Ensures all users get a fair share of the API's performance. |
| 🚫 Stop Abuse | Stops bots or scrapers from misusing your endpoints. |
| 💸 Cost Control | Reduces unwanted traffic and saves money if your backend runs on cloud resources. |

## ⚙️ How Rate Limiting Works (Conceptually)

Let's say:
* Limit = 10 requests
* Time window = 15 minutes

That means:

A single user (usually identified by IP) can make only 10 requests every 15 minutes.

After that, if they keep sending requests, your server returns a 429 Too Many Requests error.

After 15 minutes, the counter resets.

## 🧩 Your Code Explained Step-by-Step

### 1. Import the library

```javascript
const rateLimit = require('express-rate-limit');
```

✅ This imports the popular express-rate-limit package which provides ready-made middleware for limiting requests.

### 2. Create a Reusable Function

```javascript
function createBasicRateLimiter(maxRequests, time) {
  return rateLimit({
    max: maxRequests,           // maximum allowed requests
    windowMs: time,             // time window (in milliseconds)
    message: {
      success: false,
      error: "Too many requests. Please try again later."
    },
    standardHeaders: true,      // adds `RateLimit-*` headers in response
    legacyHeaders: false        // disables old headers
  });
}
```

✅ This function creates a custom rate limiter middleware that you can reuse across different routes.

You can call it with different limits, like:

```javascript
app.use(createBasicRateLimiter(10, 15 * 60 * 1000)); // 10 requests per 15 mins
```

### 3. Use It in Your App

```javascript
app.use(createBasicRateLimiter(10,15*60*1000));
```

✅ This applies the rate limiter globally to all routes in your Express app.

That means:
* Each IP can make 10 requests every 15 minutes
* If the limit is crossed, Express automatically sends this JSON:

```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

with status code 429 (Too Many Requests).

## ⚙️ You Can Also Apply It Per Route

For example:

```javascript
const loginLimiter = createBasicRateLimiter(5, 5 * 60 * 1000); // 5 requests in 5 mins

app.post("/login", loginLimiter, (req, res) => {
  res.send("Login successful");
});
```

✅ This protects your login route from brute-force attacks (hackers trying many passwords).

## 📊 Real-World Analogy

Think of a restaurant:
* Only 10 customers allowed inside at a time (maxRequests)
* After 15 minutes (windowMs), a new set of customers can enter

Same concept — keeps things under control and fair.

## 🧩 Summary

| Concept | Meaning |
|---------|---------|
| Rate Limiting | Restricting the number of requests per user/IP in a given time |
| Why needed | Prevent DDoS, abuse, and overload; ensure fair usage |
| `max` | Max number of requests |
| `windowMs` | Time window (in milliseconds) |
| Response | `429 Too Many Requests` |
| Your usage | `app.use(createBasicRateLimiter(10,15*60*1000))` → 10 requests per 15 min per IP |

✅ **In short:**

Rate limiting = Protect your API from being spammed or overloaded.
