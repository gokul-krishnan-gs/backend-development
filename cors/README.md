# Cross Origin Resource Sharing

## What is CORS?

CORS prevents malicious websites from making unauthorized requests to another website's server (like stealing user data or cookies).

By default, browsers block cross-origin requests unless the server explicitly allows them.

### What is an Origin?

An origin is made up of:

**protocol + domain + port**

Examples:
- `https://example.com` → origin is `https://example.com`
- `http://localhost:3000` → origin is `http://localhost:3000`

If your frontend and backend have different origins, your browser applies CORS rules.

---

## Example Scenario

Imagine this setup:
- **Frontend**: `http://localhost:3000`
- **Backend (API)**: `http://localhost:5000`

If your frontend JavaScript calls:

```javascript
fetch("http://localhost:5000/api/data")
```

The browser will first send a **preflight request** (an OPTIONS request) to check if the backend allows requests from `http://localhost:3000`.

### ✅ If backend allows it

The server responds with headers like:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
```

Then, the real request proceeds successfully.

### ❌ If backend does NOT allow it

The browser blocks the response, showing an error like:

```
"Access to fetch at 'http://localhost:5000/api/data' from origin 'http://localhost:3000' has been blocked by CORS policy."
```

---

## Setting Up CORS in Server

```javascript
const cors = require("cors");

function configureCors() {
  return cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:8000', 'https://myfrontend.com'];

      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed By CORS"));
      }
    },

    // ✅ 1. Allowed HTTP methods
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    // ✅ 2. Allowed request headers (client → server)
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin"
    ],

    // ✅ 3. Exposed response headers (server → client)
    // Only these headers can be read by frontend JavaScript
    exposedHeaders: [
      "Content-Length",
      "X-Custom-Header",
      "X-Response-Time"
    ],

    // ✅ 4. Allow credentials (cookies, tokens in headers)
    credentials: true,

    // ✅ 5. Continue after preflight or not
    // false = automatically handle OPTIONS preflight and respond
    preflightContinue: false,

    // ✅ 6. Cache the preflight response for this many seconds
    // reduces repeated OPTIONS requests
    maxAge: 600, // 600 seconds = 10 minutes

    // ✅ 7. Status code for successful OPTIONS (preflight) requests
    optionsSuccessStatus: 204
  });
}

module.exports = configureCors;
```

### Usage in Express

```javascript
app.use(configureCors());
```

So every request first goes through this CORS filter.

---

## Configuration Options Explained

### 🔍 1. Importing and Returning Middleware

```javascript
const cors = require("cors");

function configureCors() {
  return cors({ ... });
}
```

`cors()` is a function from the `cors` npm package that returns middleware for Express to handle CORS automatically.

---

### 🧠 2. origin (Dynamic Whitelist)

```javascript
origin: (origin, callback) => {
  const allowedOrigins = ['http://localhost:8000', 'https://myfrontend.com'];

  if (!origin || allowedOrigins.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    callback(new Error("Not Allowed By CORS"));
  }
}
```

**What it does:**
- Decides which frontend URLs can access your backend
- `origin` → the URL of the frontend sending the request (e.g., `"http://localhost:8000"`)
- `allowedOrigins` → list of trusted websites
- If the origin is in that list (or `!origin` → means Postman/curl), allow it
- Otherwise, reject it

**Response header if allowed:**
```
Access-Control-Allow-Origin: http://localhost:8000
```

---

### ⚙️ 3. methods

```javascript
methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
```

Defines which HTTP methods are permitted for cross-origin requests.

**Response header:**
```
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

Without this, if your frontend tries a PUT or DELETE request, the browser may block it.

---

### 📩 4. allowedHeaders

```javascript
allowedHeaders: [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
  "Accept",
  "Origin"
]
```

Specifies which custom request headers your frontend is allowed to send to the backend.

**Response header:**
```
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin
```

If your frontend sends custom headers (like an auth token), they must be listed here. Otherwise, browser preflight (OPTIONS) will fail.

---

### 📤 5. exposedHeaders

```javascript
exposedHeaders: [
  "Content-Length",
  "X-Custom-Header",
  "X-Response-Time"
]
```

Defines which response headers are visible to the frontend JavaScript.

Normally, browsers hide most headers for security reasons. If you want frontend code to read some headers (like `"X-Custom-Header"`), you expose them here.

**Response header:**
```
Access-Control-Expose-Headers: Content-Length, X-Custom-Header, X-Response-Time
```

Now frontend can access:
```javascript
response.headers.get("X-Custom-Header")
```

---

### 🍪 6. credentials

```javascript
credentials: true
```

Allows cookies, authorization headers, or TLS client certificates to be included in requests.

**Response header:**
```
Access-Control-Allow-Credentials: true
```

⚠️ When you use this, the origin cannot be `"*"` — it must be a specific domain.

**Example usage:**
```javascript
fetch("https://api.example.com", {
  credentials: "include"
});
```

---

### 🚦 7. preflightContinue

```javascript
preflightContinue: false
```

Controls how the server handles preflight (OPTIONS) requests.

- `false` → Express handles it automatically (sends 204 No Content)
- `true` → You must manually handle OPTIONS requests in your routes

Preflight is a safety check browser does before sending real requests (for PUT, DELETE, or custom headers).

---

### ⏱️ 8. maxAge

```javascript
maxAge: 600  // 600 seconds = 10 minutes
```

Tells the browser to cache the result of the preflight request for 10 minutes.

**Response header:**
```
Access-Control-Max-Age: 600
```

This means for the next 10 minutes, the browser won't re-check CORS for the same endpoint — faster performance.

---

### ✅ 9. optionsSuccessStatus

```javascript
optionsSuccessStatus: 204
```

Sets the HTTP status code returned for a successful preflight (OPTIONS) request.

Some older browsers (like IE11) don't accept 204 properly, so developers sometimes set it to 200. But 204 (No Content) is standard and clean — it means "success, no body."

---

## Summary Table

| Option | Purpose | Example Header |
|--------|---------|----------------|
| `origin` | Allows only trusted domains | `Access-Control-Allow-Origin` |
| `methods` | Specifies allowed HTTP methods | `Access-Control-Allow-Methods` |
| `allowedHeaders` | Headers frontend can send | `Access-Control-Allow-Headers` |
| `exposedHeaders` | Headers frontend can read | `Access-Control-Expose-Headers` |
| `credentials` | Enables cookies/auth | `Access-Control-Allow-Credentials: true` |
| `preflightContinue` | Handles OPTIONS automatically or not | — |
| `maxAge` | Caches preflight response | `Access-Control-Max-Age: 600` |
| `optionsSuccessStatus` | Status code for OPTIONS success | `204` |

---

## Key Takeaways

✅ This configuration gives you secure, flexible, production-grade CORS control:
- Only trusted origins can access
- Limited methods and headers are allowed
- Credentials are supported
- Preflight requests are optimized
