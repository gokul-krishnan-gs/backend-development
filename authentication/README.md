# Authentication

## 🔒 What is bcrypt?

**bcrypt** is a password-hashing library used to securely store user passwords in the database. It ensures that even if your database is hacked, attackers cannot see or recover the real passwords.

## 🧩 Understanding bcrypt in Simple Words

When a user signs up, they enter:

```
Password: gokul123
```

If you save this as it is (plain text) in your database — it's a huge security risk ❌ Anyone who sees your database can read every password directly.

So we use **bcrypt** to hash it (convert into an unreadable form).

## ⚙️ What bcrypt Does

### 1. Generates a Salt
A **salt** is a random string added to your password before hashing. It ensures that even if two users have the same password, their hashes are different.

**Example:**
```
Password: gokul123
Salt: a1b2c3d4
```

### 2. Hashes the Password
It mixes your password and salt using a cryptographic algorithm.

**Example output:**
```
$2b$10$9QAnTqj8Zpb6cXn3M9fNxeN7sXPW93Bl3GfFFRzJ.l7m4k0/LOdQK
```

This long random-looking string is called a **hashed password**.

### 3. Stores the Hash
Only the hash is saved in your database, never the real password.

### 4. Verifies Later
When a user logs in, bcrypt hashes the entered password again and compares it with the stored hash. If they match ➜ password is correct ✅

## ⚡ Why bcrypt is Trusted

- 🧠 **Uses a one-way hashing algorithm** → you can't "unhash" it
- 🧂 **Uses salt** → makes every hash unique
- 🐢 **Intentionally slow** → protects against brute-force attacks (hackers trying millions of passwords per second)
- 🧰 **Simple API for Node.js** (`bcrypt` npm package)

## 🧠 Using bcrypt in Node.js

**Install:**
```bash
npm install bcrypt
```

**Example usage:**
```javascript
const bcrypt = require("bcrypt");

const password = "gokul123";

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

console.log(hashedPassword);
```

**Output (random every time):**
```
$2b$10$kA8T1b4CqYzT.UhlqZVZrujT2xGQkzv6pPz8P3IZeZRtOdxqZ5S/q
```

---

# Backend Authentication System - User Registration

This is a backend authentication system (like signup/register API). It handles user registration by:

- Taking data from the client (via `req.body`)
- Checking if the user already exists
- Hashing the password securely
- Saving the new user in the database
- Sending a proper response to the client

## ⚙️ Step-by-Step Breakdown

### 🔹 1. Import Dependencies

```javascript
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
```

- **User:** Mongoose model for your users collection (used to interact with MongoDB)
- **bcryptjs:** Library used to hash (encrypt) passwords before saving them

**🧠 Why bcryptjs?**
- It's a JavaScript implementation of bcrypt, works fast and well in Node.js
- It protects passwords from being exposed even if the database is leaked

### 🔹 2. Define the Async Controller

```javascript
async function registerUser(req, res) {
  try {
```

- The function is `async` because it uses `await` for asynchronous database and hashing operations
- `req` = request object (contains client data)
- `res` = response object (used to send back JSON responses)

### 🔹 3. Extract User Data from req.body

```javascript
const { username, email, password, role } = req.body;
```

The frontend sends data like:

```json
{
  "username": "Gokul",
  "email": "gokul@gmail.com",
  "password": "mySecret123",
  "role": "user"
}
```

- Express (because of `express.json()`) automatically converts the JSON to a JS object
- These fields are destructured from the request body

### 🔹 4. Check if User Already Exists

```javascript
const checkExistingUser = await User.findOne({
  $or: [{ username }, { email }]
});
```

- This checks if any user already exists with the same username or email
- `$or` operator in MongoDB means "match if either condition is true"
- If found, it means a duplicate user

### 🔹 5. If User Exists → Return an Error

```javascript
if (checkExistingUser) {
  return res.status(400).json({
    success: false,
    message: "User already exists with same username or email! Please try with another."
  });
}
```

- Returns HTTP 400 (Bad Request) because the input data conflicts with existing users
- Stops further execution using `return`

**🧠 Why return is important:**
It prevents continuing to hash or save a duplicate user after sending the response.

### 🔹 6. Generate Salt and Hash Password

```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

**Explanation:**
- `bcrypt.genSalt(10)` → generates a random salt with 10 rounds (higher = more secure but slower)
- `bcrypt.hash(password, salt)` → combines the password and salt to create a hashed version

**🧠 Example:**
```
password = "mySecret123"
salt = "$2a$10$kA8T1b4..."
hashedPassword = "$2a$10$kA8T1b4CqYzT.UhlqZVZrujT2xGQkzv6pPz8P3IZeZRtOdxqZ5S/q"
```

The hash is what gets stored in the DB — not the plain password. Even the developer cannot recover the real password 🔐

### 🔹 7. Create a New User Document

```javascript
const newlyCreatedUser = new User({
  username,
  email,
  password: hashedPassword,
  role: role || 'user'
});
```

- Creates a new Mongoose model instance with the provided data
- If no role is given, it defaults to `'user'`
- Doesn't save it to the DB yet — just creates the object in memory

### 🔹 8. Save User to MongoDB

```javascript
await newlyCreatedUser.save();
```

- Saves the document to your MongoDB users collection
- Automatically assigns an `_id` and timestamps if enabled

### 🔹 9. Send Success or Failure Response

```javascript
if (newlyCreatedUser) {
  res.status(201).json({
    success: true,
    message: "User registered successfully!"
  });
} else {
  res.status(404).json({
    success: false,
    message: "Unable to register the user, try again"
  });
}
```

| Code | Meaning |
|------|---------|
| 201 | "Created successfully" — used for successful registration |
| 404 | "Not found" — fallback if user creation somehow failed |

### 🔹 10. Handle Any Unexpected Error

```javascript
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Internal Error"
    });
  }
}
```

- Catches any unexpected errors (DB issues, bcrypt issues, etc.)
- 500 → means "Internal Server Error"
- Logs the error for debugging

## 🧾 Summary Flow (Visually)

```
[Client Request]
     ↓
req.body → { username, email, password, role }
     ↓
Check if user exists (username/email)
     ↓
If exists → 400 Bad Request
Else →
     ↓
Generate salt
     ↓
Hash password
     ↓
Create user object
     ↓
Save user to DB
     ↓
Respond with success 201
```

## 💡 Best Practices

✅ Always hash passwords before saving (never store plain passwords)

✅ Use unique email or username check before registration

✅ Return meaningful status codes (201, 400, 500)

✅ Use try-catch to handle async errors


---

# 🧠 Authentication & JWT 

## 1. What is Authentication?

**Authentication** means verifying the identity of a user — confirming who they really are.

**In simple terms:** It's like checking the user's ID before giving them access.

### 🎬 Real-life Example

When you unlock your phone:
- You enter a PIN or fingerprint
- The phone checks if it matches your saved data
- If yes → you get access ✅
- If not → access denied ❌

That's authentication — verifying identity.

### 💻 In a Web App

When a user logs in:

1. They send username and password
2. The backend checks if the user exists
3. The backend compares entered password (plain) with stored password (hashed using bcrypt)
4. If it matches → user is authenticated (verified)
5. Backend then gives a token (JWT) as proof of identity
6. That token is used later for accessing protected routes like `/dashboard`, `/profile`, etc.

---

## 2. What is JWT (JSON Web Token)?

**JWT stands for JSON Web Token** — it's a secure digital key or identity card for users.

- After authentication, the backend gives a token (like a signed ticket)
- The user uses this token to prove they're logged in when calling other APIs

### 🎫 Real-life Example

Imagine you go to a movie theatre 🎟️

- You show your ticket at the entrance → they allow you in
- Once inside, you don't need to show your ID again — your ticket is enough

**Similarly:**
- When a user logs in successfully, backend gives a JWT token
- For every new request, the user sends this token → the backend checks it → if valid, access is granted

### 🧱 What JWT Contains

A JWT has three parts:

```
xxxxx.yyyyy.zzzzz
```

1. **Header** → contains token type & encryption algorithm
   ```json
   { "alg": "HS256", "typ": "JWT" }
   ```

2. **Payload** → contains user data (not password!)
   ```json
   { "userId": "1234", "username": "gokul", "role": "user" }
   ```

3. **Signature** → verifies token integrity using your secret key
   - This ensures nobody can modify the token

### 🧰 In Node.js (jsonwebtoken library)

**When user logs in:**

```javascript
const token = jwt.sign(
  { userId, username, role },
  process.env.JWT_SECRET_KEY,
  { expiresIn: '15m' }
);
```

- `jwt.sign()` → creates a new token
- `JWT_SECRET_KEY` → secret phrase stored in .env file (kept private)
- `expiresIn` → defines token lifetime (example: 15m, 1h, 7d)

**When the user makes further requests, the frontend sends:**

```
Authorization: Bearer <token>
```

**The backend verifies it using:**

```javascript
jwt.verify(token, process.env.JWT_SECRET_KEY)
```

- If the token is valid → request is allowed ✅
- If invalid or expired → 401 Unauthorized ❌

---

## 3. Understanding the loginUser Function

Let's go line by line 👇

### Step 1️⃣ — Get user data from request

```javascript
const { username, password } = req.body;
```

User sends login info from frontend → backend extracts it.

### Step 2️⃣ — Check if user exists

```javascript
const checkUser = await User.findOne({ username });
if (!checkUser) {
  return res.status(404).json({
    success: false,
    message: "Invalid Credentials"
  });
}
```

- Looks for a matching user in MongoDB
- If user not found → return 404 (invalid username)

### Step 3️⃣ — Compare passwords

```javascript
const hashedPassword = checkUser.password;
const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
```

- `bcrypt.compare()` checks if the entered password matches the stored hash
- Returns true or false

**If not matched:**

```javascript
return res.status(404).json({
  success: false,
  message: "Invalid Credentials"
});
```

### Step 4️⃣ — Create JWT Token

```javascript
const accessToken = jwt.sign({
  userId: checkUser._id,
  username: checkUser.username,
  role: checkUser.role
}, process.env.JWT_SECRET_KEY, {
  expiresIn: '15m'
});
```

- `jwt.sign()` creates a JWT token
- Token contains user data like ID, username, and role
- `JWT_SECRET_KEY` ensures the token can't be faked
- Token expires in 15 minutes (good for security)

### Step 5️⃣ — Send success response

```javascript
res.status(200).json({
  success: true,
  message: "User Logged In Successfully",
  accessToken
});
```

Now the frontend stores this token (in localStorage or cookies) and includes it in future API requests.

### Step 6️⃣ — Error handling

```javascript
} catch (error) {
  console.log(error);
  res.status(500).json({
    message: "Server Internal Error"
  });
}
```

If anything goes wrong (DB issue, bcrypt error, etc.), send a 500 response.

---

## 🔍 Summary Flow

```
[User enters username + password]
        ↓
Backend checks if user exists in DB
        ↓
If not found → 404 Invalid credentials
        ↓
Compare entered password with hashed password
        ↓
If matched → Create JWT token (valid for 15 mins)
        ↓
Send token to user
```
