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
# Node.js Path Module Guide

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
  

