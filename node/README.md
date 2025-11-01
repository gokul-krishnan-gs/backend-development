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
  

