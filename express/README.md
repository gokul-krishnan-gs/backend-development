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

# 🧠 What is EJS?

EJS (Embedded JavaScript) is a templating engine for Node.js and Express. It allows you to write HTML pages that can include JavaScript logic, variables, and dynamic data.

**In short:** 👉 EJS helps you generate dynamic HTML pages from your Express backend.

---

## ⚙️ How to Install and Setup EJS

### 1️⃣ Install EJS

```bash
npm install ejs
```

### 2️⃣ Set View Engine in Express

```javascript
const express = require("express");
const app = express();

app.set("view engine", "ejs");
```

Now Express knows that you'll use `.ejs` files inside a `views/` folder.

---

## 📁 Project Structure Example

```
project/
│
├── views/
│   ├── index.ejs
│   └── about.ejs
│
└── server.js
```

---

## 🧩 Example 1 — Basic EJS Page

### server.js

```javascript
const express = require("express");
const app = express();
const PORT = 8000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const title = "Welcome to Cricket Store";
  res.render("index", { pageTitle: title });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
```

### views/index.ejs

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= pageTitle %></title>
  </head>
  <body>
    <h1><%= pageTitle %></h1>
    <p>This page is rendered using EJS template.</p>
  </body>
</html>
```

✅ `res.render()` — Renders an EJS file and sends it as HTML to the browser.  
✅ `<%= %>` — Used to output (display) a value.

---

## 🧩 Example 2 — Using Loops and Conditions

### server.js

```javascript
app.get("/players", (req, res) => {
  const players = [
    { name: "Rohit Sharma", team: "India" },
    { name: "Ben Stokes", team: "England" },
    { name: "Steve Smith", team: "Australia" },
  ];
  res.render("players", { players });
});
```

### views/players.ejs

```html
<h1>Player List</h1>

<ul>
  <% players.forEach(player => { %>
    <li><%= player.name %> - <%= player.team %></li>
  <% }); %>
</ul>
```

✅ `<% %>` — for JavaScript logic (loops, if statements).  
✅ `<%= %>` — to display output on the page.

---

## 🧩 Example 3 — Conditional Rendering

```html
<% if (players.length > 0) { %>
  <p>Total Players: <%= players.length %></p>
<% } else { %>
  <p>No players found.</p>
<% } %>
```

---

## 🧾 Common EJS Tags

| Tag | Use |
|-----|-----|
| `<%= value %>` | Output value (escaped HTML) |
| `<%- value %>` | Output raw HTML |
| `<% code %>` | Run JavaScript logic (no output) |
| `<%- include('file') %>` | Include another EJS file (like a header or footer) |

---

## ⚡ Summary

| Concept | Description |
|---------|-------------|
| **EJS** | Template engine to render dynamic HTML |
| **Install** | `npm install ejs` |
| **Setup** | `app.set('view engine', 'ejs')` |
| **Render** | `res.render('filename', { data })` |
| **Syntax** | `<%= %>` for output, `<% %>` for logic |
| **Folder** | All `.ejs` files go inside `/views` |


---
# Express JSON Methods Guide

## 🧩 express.json()

* Used on the **Request side** 📨
* Converts **JSON → JavaScript Object**
* Stores it in `req.body`

### Example:

```javascript
app.use(express.json()); // Middleware

app.post("/user", (req, res) => {
  console.log(req.body); // JS object
});
```

If frontend sends:

```json
{ "name": "Gokul" }
```

Then inside server:

```javascript
req.body = { name: "Gokul" }
```

---

## 🧩 res.json()

* Used on the **Response side** 📤
* Converts **JavaScript Object → JSON**
* Sends it back to the client

### Example:

```javascript
app.get("/user", (req, res) => {
  res.json({ name: "Gokul", age: 22 });
});
```

Client receives:

```json
{ "name": "Gokul", "age": 22 }
```

---

## ⚖️ Simple Comparison Table

| Function | Direction | Conversion | Example |
|----------|-----------|------------|---------|
| `express.json()` | Request (incoming) | JSON → JS Object | `req.body` |
| `res.json()` | Response (outgoing) | JS Object → JSON | `res.json({ ... })` |

---

## 🧠 Think of it like this:

* `express.json()` **understands** JSON coming in
* `res.json()` **speaks** JSON going out
---


# REST API Complete Guide

## 🌍 1. What is an API?

**API (Application Programming Interface)** is a set of rules that allows two software programs to communicate.

👉 **Example:** When your phone's weather app requests data from a weather server, it uses an API.

---

## ⚙️ 2. What is REST?

**REST (Representational State Transfer)** is an architecture style for designing APIs using HTTP methods.

Each resource (like a product, user, post) is identified by a URL (endpoint).

---

## 🧠 3. REST API Definition

A REST API is a system that:
* Uses HTTP for communication
* Represents data as resources
* Is stateless (each request is independent)
* Returns data in JSON format

---

## 🧩 4. Core REST Concepts

| Term | Description |
|------|-------------|
| **Resource** | Data entity (example: user, product, order) |
| **Endpoint** | URL path for accessing resources (`/api/products`) |
| **Stateless** | Every request is independent |
| **Representation** | The format of data (usually JSON) |
| **Client** | The one requesting data (browser, app, frontend) |
| **Server** | The one sending response (your Node.js backend) |

---

## 🧾 5. Common HTTP Methods

| Method | Purpose | Example Endpoint |
|--------|---------|------------------|
| **GET** | Read data | `/api/products` |
| **POST** | Create new data | `/api/products` |
| **PUT** | Update entire data | `/api/products/:id` |
| **PATCH** | Update part of data | `/api/products/:id` |
| **DELETE** | Delete data | `/api/products/:id` |

---

## 🧱 6. CRUD Operations

**CRUD = Create, Read, Update, Delete**

These are the basic operations you perform using HTTP methods.

| Operation | HTTP | Example |
|-----------|------|---------|
| **Create** | POST | `/api/products` |
| **Read** | GET | `/api/products` |
| **Update** | PUT/PATCH | `/api/products/:id` |
| **Delete** | DELETE | `/api/products/:id` |

---

## 🚀 7. REST API Setup (Basic Express Example)

```javascript
const express = require("express");
const app = express();
app.use(express.json()); // Middleware to parse JSON

let products = [
  { id: 1, name: "Bat", brand: "MRF" },
  { id: 2, name: "Ball", brand: "SG" },
];

// READ (all)
app.get("/api/products", (req, res) => {
  res.json(products);
});

// READ (single)
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  product ? res.json(product) : res.status(404).send("Not Found");
});

// CREATE
app.post("/api/products", (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    brand: req.body.brand,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// UPDATE
app.put("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send("Not Found");
  product.name = req.body.name;
  product.brand = req.body.brand;
  res.json(product);
});

// DELETE
app.delete("/api/products/:id", (req, res) => {
  products = products.filter(p => p.id !== parseInt(req.params.id));
  res.send("Deleted successfully");
});

app.listen(8000, () => console.log("Server running on port 8000"));
```

---

## 🧠 8. Important Express Features Used

| Term | Description |
|------|-------------|
| `express.json()` | Middleware to parse JSON data from requests |
| `req.body` | Access data sent by the client in POST/PUT requests |
| `req.params` | Get values from URL (e.g., `/api/products/:id`) |
| `req.query` | Get query strings (e.g., `/api/products?brand=MRF`) |
| `res.send()` | Send text/HTML response |
| `res.json()` | Send JSON response |
| `res.status()` | Set HTTP status code |

---

## ⚡ 9. REST API Best Practices

### 1. Use plural nouns for endpoints
* ✅ `/api/products`
* ❌ `/api/product`

### 2. Use correct HTTP methods
* GET for reading
* POST for creating
* PUT/PATCH for updating
* DELETE for deleting

### 3. Return proper status codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

### 4. Use JSON format for all data

```json
{
  "id": 1,
  "name": "Bat",
  "brand": "MRF"
}
```

### 5. Make it stateless
Each request should contain all the data needed (no session memory).

### 6. Use proper naming
* `/api/products/:id`
* `/api/users/:userId/orders`

---

## 🧰 10. Common Tools Used

| Tool | Use |
|------|-----|
| **Postman / Thunder Client** | Test your API endpoints |
| **Nodemon** | Automatically restart server |
| **Express** | Framework for REST APIs |
