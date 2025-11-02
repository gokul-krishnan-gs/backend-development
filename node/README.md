# What is Node.js
- Node.js is a runtime environment that lets you run JavaScript outside the browser — mainly on the server side.
- It uses Google’s V8 engine (the same engine that powers Chrome) to execute JavaScript code efficiently.
- Node.js allows JavaScript to build backend servers, APIs, command-line tools, and even real-time apps like chat or games.
---
# How to Install Node.js
- Go to https://nodejs.org
- Download the LTS version (Long Term Support)
- Run the installer → keep default options → finish setup.
- Verify Installation
  ```bash
  node -v
  npm -v
  ```
  ---
  # Node.js Module System

- Modules are reusable blocks of code that you can import/export between files.
- They help keep your code organized and modular.

# Module Wrapper Function

- Node.js wraps every module inside a special function before executing it.

- Internally, your file:
```js
console.log(__filename);
console.log(__dirname);
```
...is actually wrapped like this:

```js
(function(exports, require, module, __filename, __dirname) {
  // Your code here
});
```

= exports → object to export functions/variables

= require → function to import other modules

= module → information about the current module

= __filename → absolute path of the file

=__dirname → directory of the file

---

- In Node.js, every file is treated as a separate module.
To share code between files, Node gives two main tools:

### module.exports → Used to export something from a file

### require() → Used to import that thing into another file

#### Example
```js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add,
  subtract
};


const math = require('./math');

console.log(math.add(5, 3));      // Output: 8
console.log(math.subtract(5, 3)); // Output: 2

const { add, subtract } = require('./math');


```

The following are complete notes drawn from the provided excerpts regarding npm (Node Package Manager) and Node packages.

***

## 1. What is npm (Node Package Manager)?

*   **npm** is the **Node Package Manager**.
*   It is a tool that **comes automatically with Node.js**.
*   **Purpose:** npm helps you install, manage, and share reusable pieces of code called **packages (or modules)**.
*   It can be thought of as the **Play Store for Node.js**, allowing users to download libraries such as express, mongoose, and nodemon.
*   **npm handles:** Installing packages, updating packages, managing dependencies, and running scripts.

## 2. Checking Installation

*   To verify if npm is installed after installing Node.js, open your terminal and run the command: `npm -v`.
*   If a version number is displayed, npm is ready to use.

## 3. Initializing a Project (`npm init`)

*   To create a new Node project, navigate to the project folder and run: `npm init`.
*   This process asks several questions (such as name, version, and entry file).
*   The output of this command is the **`package.json`** file, which is considered the **heart of every Node.js project**.
*   To skip all the interactive questions and instantly generate a **default** `package.json` file, use the shortcut command: `npm init -y`.

## 4. `package.json` Structure and Key Fields

The `package.json` file contains important fields that define the project.

| Field | Meaning |
| :--- | :--- |
| `name` | Project name |
| `version` | Project version |
| `main` | Entry point of the app |
| `scripts` | **Custom commands you can run** |
| `dependencies` | Libraries needed to **run your app** |
| `devDependencies` | Tools needed **only for development** (not production) |

## 5. Installing Packages

### Normal Dependencies

*   Normal dependencies are libraries needed to run the application.
*   **Command:** `npm install express` or the short form `npm i express`.
*   This action adds the package to the project and updates the `"dependencies"` section in `package.json`.

### Development Dependencies (`devDependencies`)

*   Dev dependencies are tools needed only for development purposes, **not for production**.
*   Examples include nodemon, eslint, and jest.
*   **Command:** `npm install nodemon --save-dev` or the short form `npm i nodemon -D`.
*   This installs the tool and places it in the `"devDependencies"` section of `package.json`.

## 6. Managing Packages

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Updating** a single package | `npm update express` | Updates the specific package |
| **Updating** all packages | `npm update` | Updates all dependencies |
| **Checking** outdated packages | `npm outdated` | Lists packages that need updating |
| **Uninstalling** a package | `npm uninstall express` or `npm remove express` | Removes the package |

When a package is uninstalled, it is deleted from the `node_modules/` folder and removed from the `package.json` file.

## 7. Scripts Setup (Shortcuts)

*   The `scripts` section inside `package.json` is useful for defining **shortcuts**.
*   **Example setup:** The scripts might include `"start": "node index.js"` and `"dev": "nodemon index.js"`.
*   **Running Scripts:**
    *   To run the `start` script, use: `npm start` (this runs `node index.js` in the example).
    *   To run other custom commands, use: `npm run [script_name]` (e.g., `npm run dev` runs `nodemon index.js`).
*   These scripts are frequently utilized in real-world backend projects.

## 8. Essential Project Files and Folders

| File/Folder | Description |
| :--- | :--- |
| `node_modules/` | This is the directory where **all installed packages actually live**. |
| `package-lock.json` | This file keeps the **exact versions of dependencies for consistency**. |

If the `node_modules` folder is deleted, all packages can be easily reinstalled using the command: `npm install`.
---
# Node.js Path Module 

## 🧭 1. What is the Path Module?

The `path` module is a core (built-in) Node.js module that provides utilities for working with file and directory paths in a cross-platform way.

✅ It handles differences between:
* Windows paths: `C:\users\gokul\file.txt`
* Linux/macOS paths: `/users/gokul/file.txt`

So your app works everywhere without breaking.

---

## ⚙️ 2. How to Import It

You don't need to install anything — it's built into Node.

```javascript
const path = require('path');
```

---

## 📘 3. Commonly Used Path Methods

Let's explore the most important ones with examples 👇

### 🔹 path.join()

👉 Joins multiple path segments together and normalizes the result.

```javascript
const filePath = path.join(__dirname, 'folder', 'file.txt');
console.log(filePath);
```

**Output:**
```
C:\Users\Gokul\project\folder\file.txt
```

✅ Automatically fixes slashes (`/` or `\`) depending on the OS.

---

### 🔹 path.resolve()

👉 Returns an absolute path from a sequence of paths.

```javascript
const fullPath = path.resolve('folder', 'file.txt');
console.log(fullPath);
```

**Output (depends on where you run it):**
```
C:\Users\Gokul\project\folder\file.txt
```

✅ **Difference between `join()` and `resolve()`:**
* `join()` combines paths.
* `resolve()` gives you the absolute path.

---

### 🔹 path.basename()

👉 Returns the file name from a path.

```javascript
const fullPath = '/users/gokul/app/index.js';
console.log(path.basename(fullPath)); // index.js
```

You can also remove the extension:

```javascript
console.log(path.basename(fullPath, '.js')); // index
```

---

### 🔹 path.dirname()

👉 Returns the directory part of a path.

```javascript
console.log(path.dirname('/users/gokul/app/index.js'));
```

**Output:**
```
/users/gokul/app
```

---

### 🔹 path.extname()

👉 Returns the file extension.

```javascript
console.log(path.extname('index.html')); // .html
console.log(path.extname('server.js'));  // .js
```

---

### 🔹 path.parse()

👉 Breaks a path into its components (object form).

```javascript
const parsed = path.parse('/users/gokul/app/index.js');
console.log(parsed);
```

**Output:**
```javascript
{
  root: '/',
  dir: '/users/gokul/app',
  base: 'index.js',
  ext: '.js',
  name: 'index'
}
```

---

### 🔹 path.format()

👉 Opposite of `path.parse()` — it builds a path object back into a string.

```javascript
const formatted = path.format({
  dir: '/users/gokul/app',
  name: 'index',
  ext: '.js'
});

console.log(formatted); // /users/gokul/app/index.js
```

---

## 🧠 4. Special Global Variables

These two are often used with the path module:

| Variable | Description |
|----------|-------------|
| `__dirname` | Directory path of the current file |
| `__filename` | Full path of the current file |

**Example:**

```javascript
console.log(__dirname);  // e.g., C:\Users\Gokul\project
console.log(__filename); // e.g., C:\Users\Gokul\project\app.js
```

Use them with `path.join()` to safely build paths:

```javascript
const file = path.join(__dirname, 'data', 'info.txt');
console.log(file);
```

---

## ⚡ 5. Summary Table

| Method | Description | Example |
|--------|-------------|---------|
| `path.join()` | Joins paths safely | `path.join('folder', 'file.txt')` |
| `path.resolve()` | Gives absolute path | `path.resolve('folder', 'file.txt')` |
| `path.basename()` | Gets file name | `path.basename('/app.js')` |
| `path.dirname()` | Gets directory | `path.dirname('/app.js')` |
| `path.extname()` | Gets file extension | `path.extname('app.js')` |
| `path.parse()` | Splits path into parts | `path.parse('/app.js')` |
| `path.format()` | Rebuilds path from parts | `path.format({...})` |
  
---

# Node.js File System (fs) Module 

## 🧱 1. What is the File System (fs) Module?

The `fs` module is a core built-in module in Node.js that allows you to work with your computer's file system.

✅ You can:
* Create, read, write, rename, or delete files/folders
* Work with files in sync (blocking) or async (non-blocking) ways

## ⚙️ 2. Importing the fs Module

You don't need to install it:

```javascript
const fs = require('fs');
```

## ⚖️ 3. Sync vs Async Methods

| Mode | Description | Blocks Code Execution? |
|------|-------------|------------------------|
| Synchronous | Methods with `Sync` at the end (e.g. `readFileSync`) | ❌ Yes (Waits until done) |
| Asynchronous | Methods without `Sync` (e.g. `readFile`) | ✅ No (Runs in background, uses callback) |

In production, always prefer async to avoid blocking your app.

## 📖 4. Reading a File

### 🔹 Asynchronous way (recommended)

```javascript
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});
```

✅ Doesn't block the rest of the code — executes the callback when done.

### 🔹 Synchronous way

```javascript
try {
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log('File content:', data);
} catch (err) {
  console.error('Error reading file:', err);
}
```

⚠️ This blocks other operations until the file is fully read.

## ✍️ 5. Writing to a File

### 🔹 Async

```javascript
fs.writeFile('example.txt', 'Hello, Gokul!', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully!');
});
```

✅ If the file doesn't exist, Node will create it automatically.

### 🔹 Sync

```javascript
fs.writeFileSync('example.txt', 'Hello, Gokul!');
console.log('File written successfully!');
```

## ➕ 6. Appending Data

### 🔹 Async

```javascript
fs.appendFile('example.txt', '\nThis is new content.', (err) => {
  if (err) throw err;
  console.log('Data appended successfully!');
});
```

### 🔹 Sync

```javascript
fs.appendFileSync('example.txt', '\nThis is new content.');
```

## ❌ 7. Deleting a File

### 🔹 Async

```javascript
fs.unlink('example.txt', (err) => {
  if (err) throw err;
  console.log('File deleted!');
});
```

### 🔹 Sync

```javascript
fs.unlinkSync('example.txt');
```

## 🏷️ 8. Renaming a File

### 🔹 Async

```javascript
fs.rename('old.txt', 'new.txt', (err) => {
  if (err) throw err;
  console.log('File renamed successfully!');
});
```

### 🔹 Sync

```javascript
fs.renameSync('old.txt', 'new.txt');
```

## 📁 9. Working with Directories

### 🔹 Create Folder

```javascript
fs.mkdir('myFolder', (err) => {
  if (err) throw err;
  console.log('Folder created!');
});
```

### 🔹 Remove Folder

```javascript
fs.rmdir('myFolder', (err) => {
  if (err) throw err;
  console.log('Folder deleted!');
});
```

(For deleting folders with files, use `fs.rm('myFolder', { recursive: true })` in Node 14+.)

## 🧩 10. Example: Reading and Writing Together

```javascript
fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) throw err;
  const output = `Uppercase: ${data.toUpperCase()}`;
  
  fs.writeFile('output.txt', output, (err) => {
    if (err) throw err;
    console.log('File processed and written!');
  });
});
```

✅ This reads `input.txt`, processes it, and saves it to `output.txt` asynchronously.

## 📚 11. Summary Table

| Operation | Async Method | Sync Method |
|-----------|--------------|-------------|
| Read File | `fs.readFile()` | `fs.readFileSync()` |
| Write File | `fs.writeFile()` | `fs.writeFileSync()` |
| Append File | `fs.appendFile()` | `fs.appendFileSync()` |
| Delete File | `fs.unlink()` | `fs.unlinkSync()` |
| Rename File | `fs.rename()` | `fs.renameSync()` |
| Create Folder | `fs.mkdir()` | `fs.mkdirSync()` |
| Remove Folder | `fs.rmdir()` / `fs.rm()` | `fs.rmdirSync()` / `fs.rmSync()` |

## 💡 Pro Tip: Use Promises (Modern Way)

Instead of callbacks, you can use promises with `fs.promises`:

```javascript
const fs = require('fs').promises;

async function readWrite() {
  try {
    const data = await fs.readFile('example.txt', 'utf8');
    await fs.writeFile('new.txt', data.toUpperCase());
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
}

readWrite();
```

✅ Cleaner and easier to manage for modern async/await style apps.


---
# Node.js HTTP Module

## What is the HTTP Module?

The http module in Node.js allows you to create web servers and handle HTTP requests and responses without any external packages. It's a built-in module — no need to install it.

## Importing the HTTP Module

```javascript
const http = require('http');
```

## Creating a Server

```javascript
const server = http.createServer((req, res) => {
  // req = request object (incoming data)
  // res = response object (outgoing data)
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello Gokul, your Node.js server is running!');
});
```

## Starting the Server

```javascript
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

## Routing in Node.js (Basic Way)

You can handle multiple routes by checking the URL:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/') {
    res.end('Home Page');
  } else if (req.url === '/about') {
    res.end('About Page');
  } else if (req.url === '/contact') {
    res.end('Contact Page');
  } else {
    res.statusCode = 404;
    res.end('404 Page Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Request and Response Objects

- **req.url** → Path of the request (e.g., /about)
- **req.method** → HTTP method (e.g., GET, POST)
- **res.writeHead(statusCode, headers)** → Set response headers
- **res.end(data)** → End the response and send data to the client

## Synchronous vs Asynchronous

The HTTP module is non-blocking (asynchronous) by default. It can handle thousands of client requests efficiently without creating multiple threads.

## Summary

| Feature | Description |
|---------|-------------|
| Module Name | http |
| Purpose | Create servers and handle requests/responses |
| Routing | Done manually by checking req.url |
| Type | Core (built-in) module |
| Common Port | 3000 or 8080 |

## HTTP Methods

You can check the method with req.method (always uppercase).

Use methods properly for RESTful APIs:

- **GET** → Read
- **POST** → Create
- **PUT/PATCH** → Update
- **DELETE** → Delete

In real projects, we use frameworks like Express.js to simplify this process.

## Handling Different HTTP Methods

Let's handle GET, POST, PUT, and DELETE using req.method and req.url:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/users' && req.method === 'GET') {
    res.end('Fetching all users...');
  }

  else if (req.url === '/users' && req.method === 'POST') {
    res.end('Creating a new user...');
  }

  else if (req.url === '/users' && req.method === 'PUT') {
    res.end('Updating user details...');
  }

  else if (req.url === '/users' && req.method === 'DELETE') {
    res.end('Deleting a user...');
  }

  else {
    res.statusCode = 404;
    res.end('404 Not Found');
  }
});

server.listen(3000, () => console.log('Server running on port 3000'));
```

### Method Explanation

| Method | Purpose | Example Use |
|--------|---------|-------------|
| GET | Fetch data from the server | Display list of users |
| POST | Send data to the server | Submit a new user form |
| PUT | Update existing data | Change full user details |
| DELETE | Remove data from the server | Delete a specific user |

## HTTP Response Object (res) Methods and Properties

When you create a server using the http module:

```javascript
const server = http.createServer((req, res) => { ... });
```

The res object (response) allows you to:
- Set headers
- Set status code and status message
- Send data back to the client

### 1. res.setHeader(name, value)

Sets a specific HTTP header (key–value pair) for the response.

```javascript
res.setHeader('Content-Type', 'text/html');
res.setHeader('X-Powered-By', 'Node.js');
```

**Use:** To tell the browser what kind of content you're sending (HTML, JSON, plain text, etc.)

### 2. res.statusCode

Sets the numeric HTTP status code (e.g., 200 for OK, 404 for Not Found).

```javascript
res.statusCode = 200;  // OK
```

**Common status codes:**

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

### 3. res.statusMessage

Sets a short text message that goes with the status code. This is optional — browsers usually use default messages.

```javascript
res.statusCode = 404;
res.statusMessage = 'Page Not Found';
```

This would send:
```
HTTP/1.1 404 Page Not Found
```

### 4. res.writeHead(statusCode, headers)

Sets the status code and response headers together in one line. It's a shortcut method.

```javascript
res.writeHead(200, { 'Content-Type': 'text/plain', 'X-Powered-By': 'Node.js' });
```

**Example:**

```javascript
res.writeHead(404, { 'Content-Type': 'text/plain' });
res.end('404 - Page Not Found');
```

### 5. res.write(data)

Writes data to the response body. You can call this multiple times before ending.

```javascript
res.write('Hello ');
res.write('Gokul!');
```

### 6. res.end([data])

Ends the response — this must be called for every request, or the browser will keep waiting. You can also send the final chunk of data inside it.

```javascript
res.end('Server response completed!');
```

## Example Combining All Methods

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // Set header
  res.setHeader('Content-Type', 'text/plain');

  // Set status code and message
  res.statusCode = 200;
  res.statusMessage = 'OK';

  // Write Head (optional shortcut)
  // res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Write and end response
  res.write('Hello, this is a response from Node.js server.\n');
  res.end('Request handled successfully!');
});

server.listen(3000, () => console.log('Server running at http://localhost:3000'));
```
# What is an Event Emitter in Node.js?

Node.js is built on events — things like "data received," "connection closed," or "file finished reading."

The Event Emitter is the core mechanism that allows objects to:
* Emit (trigger) named events
* Listen (subscribe) to those events
* React when those events occur

It's part of Node.js's `events` core module.

## 🔹 Importing EventEmitter

```javascript
const EventEmitter = require('events');
```

Then you can create an instance:

```javascript
const emitter = new EventEmitter();
```

## 🔹 Basic Example

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// 1️⃣ Listen for an event
emitter.on('greet', () => {
  console.log('Hello, Gokul!');
});

// 2️⃣ Emit (trigger) the event
emitter.emit('greet');
```

Output:

```
Hello, Gokul!
```

✅ The `.on()` method is used to listen, and `.emit()` is used to trigger the event.

## 🧠 EventEmitter Methods

| Method | Description |
|--------|-------------|
| `.on(event, listener)` | Register a listener for an event |
| `.emit(event, [args...])` | Trigger the event (can pass arguments) |
| `.once(event, listener)` | Listen only once; auto removes after first emit |
| `.removeListener(event, listener)` | Remove a specific listener |
| `.removeAllListeners([event])` | Remove all listeners for an event |
| `.listenerCount(event)` | Returns how many listeners an event has |

## 🔹 Passing Arguments to Events

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('order', (item, quantity) => {
  console.log(`Order received: ${quantity} x ${item}`);
});

emitter.emit('order', 'Pizza', 2);
```

Output:

```
Order received: 2 x Pizza
```

## 🔹 `once()` — Listen Only One Time

```javascript
emitter.once('login', () => {
  console.log('User logged in (only once)');
});

emitter.emit('login');
emitter.emit('login');
```

Output:

```
User logged in (only once)
```

## 🔹 Removing Event Listeners

```javascript
function greet() {
  console.log('Hi Gokul!');
}

emitter.on('hello', greet);
emitter.removeListener('hello', greet); // or emitter.off('hello', greet);
emitter.emit('hello'); // No output
```

## 🔹 Practical Example — Custom Event with Logic

```javascript
const EventEmitter = require('events');

class School extends EventEmitter {
  startPeriod() {
    console.log('Class period started');
    // Emit custom event
    this.emit('bellRing', { period: '1st', time: '9:00 AM' });
  }
}

const school = new School();

// Listen for the event
school.on('bellRing', (data) => {
  console.log(`Bell rang for ${data.period} period at ${data.time}`);
});

// Trigger
school.startPeriod();
```

Output:

```
Class period started
Bell rang for 1st period at 9:00 AM
```
