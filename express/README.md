# 🚀 What is Express.js?

Express.js is a lightweight and powerful Node.js framework used to build web applications and APIs easily. It simplifies server creation, routing, and handling requests/responses.

## 🧩 In simple terms:

Express = Node.js + Easy Routing + Middleware + Cleaner Code

## ⚙️ Installing Express

Before using Express, initialize your project and install it:

```bash
npm init -y       # creates package.json
npm install express
```

Then, import and create your app:

```javascript
const express = require('express');
const app = express();
```

## 🌍 app

* `app` is an instance of Express.
* It represents your web server and is used to define routes, middleware, and settings.

Example:

```javascript
const app = express();
```

## 🛣️ app.get()

Used to define a GET route (to handle requests from browser or API clients).

Syntax:

```javascript
app.get(path, callback);
```

Example:

```javascript
app.get('/', (req, res) => {
  res.send('Hello World');
});
```

✅ Path → `'/'`  
✅ Callback → function that runs when this route is accessed

## 🧏‍♂️ app.listen()

Starts the Express server and listens for incoming requests.

```javascript
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

📌 Without `app.listen()`, your server won't actually start.

## 🧭 Routing

Routing means defining different URLs and what should happen when users visit them.

Example:

```javascript
app.get('/', (req, res) => res.send('Home Page'));
app.get('/about', (req, res) => res.send('About Page'));
```

📍 `"/"` → route for homepage  
📍 `"/about"` → route for about page

## 📤 res (Response Object)

`res` is used to send a response back to the client (browser or API user).

### 👉 `res.send()`

Sends a simple response (string, HTML, etc.)

```javascript
res.send('Hello World');
```

### 👉 `res.status()`

Sets the HTTP status code (like 200 OK, 404 Not Found, 500 Error)

```javascript
res.status(404).send('Page Not Found');
```

### 👉 `res.json()`

Sends JSON data (commonly used for APIs)

```javascript
res.json({ id: 1, name: 'Bat', brand: 'MRF' });
```

## 📩 req (Request Object)

`req` contains data sent from the client to the server (URL params, body, headers, etc.)

### 🔢 req.params

Used to get route parameters from the URL.

Example:

```javascript
app.get('/api/products/:id', (req, res) => {
  console.log(req.params.id);
  res.send(`Product ID: ${req.params.id}`);
});
```

If you visit `/api/products/5`, 👉 `req.params.id` will be `'5'`

## ✅ Quick Summary Table

| Keyword | Description | Example |
|---------|-------------|---------|
| `express()` | Creates an Express app | `const app = express();` |
| `app.get()` | Define GET route | `app.get('/', (req, res) => res.send('Hi'));` |
| `app.listen()` | Start server | `app.listen(8000)` |
| `res.send()` | Send text/HTML response | `res.send('OK')` |
| `res.status()` | Set HTTP status code | `res.status(404).send('Not Found')` |
| `res.json()` | Send JSON response | `res.json({name:'Gokul'})` |
| `req.params` | Get URL parameters | `/user/:id` → `req.params.id` |

# 🧠 Middleware in Express.js

## 🔹 Definition

A middleware is a function that runs between the request and the response in an Express application. It can modify the request, perform actions, or control the flow of how the request is handled.

## ⚙️ Syntax

```javascript
app.use((req, res, next) => {
  // your code here
  next(); // pass control to the next middleware or route
});
```

## 🎯 Main Uses of Middleware

1. **Logging** – To print or record request info.
2. **Authentication** – To verify users before allowing access.
3. **Parsing** – To read data from `req.body` (JSON, forms).
4. **Serving static files** – To send HTML, CSS, images, etc.
5. **Error handling** – To catch and manage errors.
6. **Custom logic** – To modify or add properties to `req` or `res`.

## 🧩 `app.use()`

- Used to register middleware globally.
- Every request passes through this middleware.

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

## 🔹 `next()`

Moves control to the next middleware or route handler.

**Important:** If `next()` is not called and no response is sent → the request will hang (no reply).

**Example:**

```javascript
app.use((req, res, next) => {
  console.log("Middleware running...");
  next();
});
```

## 🔹 Types of Middleware

- **Application-level** – Created using `app.use()` or `app.METHOD()`.
- **Router-level** – Works on specific routes using `express.Router()`.
- **Built-in** – Provided by Express (like `express.json()`, `express.static()`).
- **Third-party** – External packages like `morgan`, `cors`, etc.

## 🔹 Example

```javascript
const express = require("express");
const app = express();

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Authentication middleware
app.use((req, res, next) => {
  if (req.query.token === "1234") next();
  else res.status(403).send("Access Denied");
});

app.get("/", (req, res) => {
  res.send("Welcome to Cricket Store");
});

app.listen(8000, () => console.log("Server running at 8000"));
```

## ⚡ Summary Table

| Keyword | Description |
|---------|-------------|
| **Middleware** | Function between request and response |
| **app.use()** | Registers middleware |
| **next()** | Moves to next middleware or route |
| **If next() not called** | Request stops / hangs |
| **Common uses** | Logging, Auth, Parsing, Static, Error Handling |
