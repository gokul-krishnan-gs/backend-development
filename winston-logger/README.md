# 🧠 What is Winston?

Winston is a logging library for Node.js that helps you record, organize, and manage log messages in your application. It's like a professional version of `console.log()` — smarter, cleaner, and more powerful.

## 💡 Why Do We Need Winston?

In real-world projects, you don't just log things to the console — you need logs that are:

* **Organized** (different levels: info, warn, error)
* **Persistent** (saved to files)
* **Structured** (in JSON or readable format)
* **Filterable** (see only errors or only requests)
* **Useful for debugging & monitoring** (to know what went wrong and when)

That's where Winston helps.

## ⚙️ How Winston Works

1. You create a logger with custom settings.
2. You define:
   * **Log level** (debug, info, warn, error, etc.)
   * **Format** (timestamp, color, JSON, etc.)
   * **Transports** (where to store logs — console, file, database, etc.)
3. Then, you use it anywhere in your app:

```javascript
logger.info("Server started");
logger.error("Database connection failed");
```

## 📚 Common Log Levels

| Level | Purpose |
|-------|---------|
| error | Something broke or crashed |
| warn | Something suspicious or risky |
| info | General updates (like server started) |
| http | Request/response logs |
| debug | Developer-level details |

## 💼 Use Cases

### ✅ 1. Server Startup
* Log when your server starts or stops
* Example: `logger.info("Server running on port 3000")`

### ✅ 2. Error Handling
* When something fails, log it with details
* Example: `logger.error("User creation failed: %s", err.message)`

### ✅ 3. API Monitoring
* Log each HTTP request made to your app
* Example: `logger.http("GET /users")`

### ✅ 4. Debugging
* Track app flow or data for development
* Example: `logger.debug("Fetching user from cache")`

### ✅ 5. Production Logging
* Store logs in files (`combined.log`, `error.log`)
* Helps in analyzing issues later

## 🧩 Where Logs Can Go (Transports)

* **Console**: For live viewing during development
* **File**: To save and analyze later
* **Database/Cloud** (optional): For advanced log tracking (e.g., ELK Stack, Datadog)

## 🧾 Simple Summary

Winston helps developers record and manage logs (like info, warnings, or errors) in a professional and organized way. It's mainly used for debugging, monitoring, and analyzing what happens inside your app, especially in production.
# Winston Logger Configuration

## 

### Import Winston

```javascript
const winston = require("winston");
```

**What it does:** Imports the Winston logging library so you can create and configure loggers.

---

### Create Logger Instance

```javascript
const logger = winston.createLogger({
```

**What it does:** Creates a new logger instance and opens the configuration object where you define how logging behaves (levels, formats, transports).

---

### Set Log Level

```javascript
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
```

**What it does:** Chooses which messages the logger will record based on environment.

- If `NODE_ENV` is `"production"` → logger level is `"info"`
- Otherwise (development) → level is `"debug"`

**Why this matters:** Winston uses a priority list of levels:
- `error` (0) - highest priority
- `warn` (1)
- `info` (2)
- `http` (3)
- `verbose` (4)
- `debug` (5)
- `silly` (6) - lowest priority

If level is set to `"info"`, Winston will record `error`, `warn`, and `info` messages (levels with equal or higher priority), but not `http`, `debug`, etc.

---

### Configure Format Pipeline

```javascript
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
```

**What it does:** Tells Winston how to shape each log message before sending it to transports. The `combine()` function runs each formatter in order:

1. **`winston.format.timestamp()`** — Adds a timestamp field (ISO time) to the log info object
2. **`winston.format.errors({ stack: true })`** — If the logged value is an Error, includes the stack trace on the `stack` property so file logs contain full error details
3. **`winston.format.splat()`** — Enables `%s` / `%d` style interpolation (like `logger.info("User %s logged in", username)`)
4. **`winston.format.json()`** — Outputs the final log as a JSON object (good for file storage and automated parsing)

**Result:** File transports using this format will receive well-structured JSON logs that include timestamp, level, message, optional stack, and any metadata.

---

### Add Default Metadata

```javascript
  defaultMeta: { service: "user-service" },
```

**What it does:** Adds this object to every log entry. Useful to identify which service emitted the log (especially in multi-service systems).

---

### Configure Transports

```javascript
  transports: [
```

**What it does:** Defines where logs go. Each transport is an output target (console, file, remote service, etc.).

#### Console Transport

```javascript
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
```

**What it does:** Adds a console transport that prints logs to the terminal.

- Overrides the top-level format for console output
- **`colorize()`** — Adds terminal colors by level (makes output easier to read)
- **`simple()`** — Prints a short human-readable line like: `info: Server started`

**Key detail:** The console transport uses its own format, so console output will be human-friendly but not JSON/timestamped.

#### Error File Transport

```javascript
    new winston.transports.File({ filename: "error.log", level: "error" }),
```

**What it does:** Writes only logs with level `error` to `error.log`. Because the top-level format is JSON+timestamp, the file will contain JSON lines with timestamp and stack traces for errors.

#### Combined File Transport

```javascript
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

**What it does:** Writes all logs that pass the logger level (info, warn, error, and depending on configured level) to `combined.log`. This file will contain JSON entries because it uses the top-level JSON format.

---

### Export Logger

```javascript
module.exports = logger;
```

**What it does:** Exports the configured logger so other modules can `const logger = require('./logger')` and call `logger.info()`, `logger.error()`, etc.

---

## Example Usage

```javascript
logger.info("Server started on port %d", 3000);
logger.http("GET /api/users");
logger.warn("Cache miss for user %s", userId);
logger.error("DB connection failed: %s", err.message, err);
```

---

## Sample Outputs

### 1. Console Output (Human-Friendly)

Because console transport uses `simple()` and `colorize()`, typical console lines look like:

```
info: Server started on port 3000
http: GET /api/users
warn: Cache miss for user 12345
error: DB connection failed: connection timeout
```

*(Actual colors will be applied in your terminal — error in red, warn in yellow, info in green, etc.)*

**Note:** Console lines will not show timestamp or JSON fields because the console transport uses `simple()` format.

---

### 2. combined.log (JSON Entries)

Each line is a JSON object (one per log). Example contents:

```json
{"level":"info","message":"Server started on port 3000","timestamp":"2025-11-13T11:00:00.123Z","service":"user-service"}
{"level":"http","message":"GET /api/users","timestamp":"2025-11-13T11:00:01.456Z","service":"user-service"}
{"level":"warn","message":"Cache miss for user 12345","timestamp":"2025-11-13T11:00:02.789Z","service":"user-service"}
```

Because `format.json()` was used, you can parse these logs programmatically (ELK/Logstash, Datadog, etc.).

---

### 3. error.log (JSON with Stack Trace)

When an error is logged (and you pass the error object), the file will include `stack` because `errors({stack:true})` is enabled:

```json
{
  "level": "error",
  "message": "DB connection failed: connection timeout",
  "timestamp": "2025-11-13T11:00:05.987Z",
  "service": "user-service",
  "stack": "Error: connection timeout\n    at ...stack trace lines..."
}
```

*(Actual file will store each log as a single-line JSON entry; shown here prettified for readability.)*

---

## Important Practical Notes

### Log Level Semantics
If level is `"info"` in production, `logger.http()` (which is lower priority than info) will not be recorded. Use `level: 'http'` or `debug` if you want http logs in production, or send request logs through dedicated middleware configured to log at info level.

### Console vs File Formats
You intentionally use a readable console format and a structured JSON file format. That's common: console for humans, files for machines.

### Stack Traces
Include actual Error objects in `logger.error(err)` or `logger.error("msg", err)` so `errors({stack:true})` can capture the stack.

### Rotation & Size
Winston File transport does not rotate by default. For production you should configure log rotation (e.g., `winston-daily-rotate-file`) or ship logs to a centralized logging service.

---

##  Summary

✅ Logs more verbosely in development and less in production  
✅ Prints readable colored logs to the console  
✅ Saves all structured JSON logs to `combined.log`  
✅ Saves error-only logs (with stack traces) to `error.log`  
✅ Tags every log with `service: "user-service"`  
✅ Is exported so you can use `logger.info()`, `logger.error()` everywhere in your app
