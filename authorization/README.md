# Authorization

## ⚙️ 1️⃣ Authentication vs Authorization

| Concept | Definition | Example |
|---------|-----------|---------|
| **Authentication** | Verifies who the user is. | Logging in using username and password. |
| **Authorization** | Verifies what the user is allowed to do. | Only admins can delete a user. |

👉 **You must authenticate before authorization can happen.**

**Example:**
- **Authentication** → "I am Gokul."
- **Authorization** → "Gokul is an admin, so he can access /api/admin."

## 🔒 2️⃣ What Is Authorization in Backend?

Authorization means controlling user access to specific parts of your application.

**You use authorization to:**
- Allow users to only access their data.
- Restrict certain routes (like `/api/admin`) to admins only.
- Prevent unauthorized users from performing dangerous actions (like deleting data).

## 🧩 3️⃣ How Authorization Works (The Flow)

Here's how the request flow works from frontend → backend:

1. **User logs in** → backend verifies → sends back JWT token.
2. **Frontend stores the token** (localStorage / cookie).
3. **For every protected API request**, frontend sends the token in the header:
   ```
   Authorization: Bearer <token>
   ```
4. **The backend uses `authMiddleware`** to:
   - Verify the token.
   - Decode user info (id, username, role).
   - Attach user info to `req.userInfo`.
5. **Then route handlers** (and optionally `adminMiddleware`) use that info to check what the user is allowed to do.

## 🧠 4️⃣ Auth Middleware — The Backbone of Authorization

The authentication middleware (also called auth middleware) ensures that every request coming to a protected route:
- Has a valid JWT token.
- Is coming from a logged-in user.
- Allows further role-based filtering later.

### 🔹 Example Code: auth-middleware.js

```javascript
const jwt = require('jsonwebtoken');

function authMiddleWare(req, res, next) {
  // Step 1: Get Authorization Header
  const authHeader = req.headers['authorization']; // Example: 'Bearer <token>'

  // Step 2: Extract the token part
  const token = authHeader && authHeader.split(' ')[1]; // Get token only

  // Step 3: If no token found, block access
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied. No token provided.'
    });
  }

  // Step 4: Verify the token using JWT secret
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decoded; // Store decoded info for next route
    next(); // Pass control to next middleware or route
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or Expired Token.'
    });
  }
}

module.exports = authMiddleWare;
```

### 🧾 What Happens Step-by-Step

**1. Token Check**
- The middleware looks for a header named `Authorization`.
- Format: `"Bearer <token>"`.

**2. Extract the Token**
- Splits the string and extracts the JWT part.

**3. Verify the Token**
- Uses the secret key (same one used during login) to decode it.
- JWT verifies whether the token was modified or expired.

**4. Attach Decoded Info**
- After verification, user data like:
  ```javascript
  { userId, username, role }
  ```
  is attached to the request object as `req.userInfo`.

**5. Call next()**
- Allows the request to move forward to the actual route handler.

**6. If Invalid → Block the request**
- If the token is missing or invalid, respond with 401 Unauthorized.

## 🧱 5️⃣ Protected Routes Explained

A protected route is any API endpoint that requires a valid token to access.

**For example:**

### ✅ Public Route
```javascript
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is a public route — anyone can access' });
});
```

### 🔒 Protected Route
```javascript
const authMiddleWare = require('../middleware/auth-middleware');

app.get('/api/profile', authMiddleWare, (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    user: req.userInfo
  });
});
```

**🧠 Explanation:**
- The route will first run `authMiddleWare`.
- Only if `authMiddleWare` calls `next()`, the route logic executes.
- Otherwise, the user receives "Access Denied."

## 👑 6️⃣ Role-Based Authorization (Admin Middleware)

Once you have authentication working, you can add role-based checks.

### Example: admin-middleware.js
```javascript
function adminMiddleWare(req, res, next) {
  // req.userInfo is available from authMiddleware
  if (req.userInfo.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied. Only Admins can access this route.'
    });
  }
  next(); // If role is admin, continue
}

module.exports = adminMiddleWare;
```

### Example: Admin Route
```javascript
const express = require('express');
const authMiddleWare = require('../middleware/auth-middleware');
const adminMiddleWare = require('../middleware/admin-middleware');
const router = express.Router();

router.get('/dashboard', authMiddleWare, adminMiddleWare, (req, res) => {
  res.json({
    message: 'Welcome to the Admin Dashboard!'
  });
});

module.exports = router;
```

**🧠 Here's what happens:**
1. `authMiddleWare` runs first → verifies token.
2. If valid, it attaches user info.
3. Then `adminMiddleWare` runs → checks if `role === 'admin'`.
4. If yes → route executes; otherwise → 403 error.

## 📦 7️⃣ Folder Structure Example

Here's how a clean production folder structure looks:

```
project/
│
├── server.js
├── .env
│
├── database/
│   └── db.js
│
├── models/
│   └── User.js
│
├── routes/
│   ├── auth-routes.js
│   ├── home-routes.js
│   └── admin-routes.js
│
└── middleware/
    ├── auth-middleware.js
    └── admin-middleware.js
```

## 🧭 8️⃣ Real-World Flow (Example)

### Step 1: Login

**User logs in with:**
```json
{
  "username": "gokul",
  "password": "mypassword"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Step 2: Access Home Route

**Frontend sends:**
```
GET /api/home/welcome
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "message": "Welcome to Home Page",
  "user": {
    "_id": "672b8...",
    "username": "gokul",
    "role": "user"
  }
}
```

### Step 3: Access Admin Route

```
GET /api/admin/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**If role = admin ✅:**
```json
{ "message": "Welcome to the Admin Dashboard!" }
```

**If role = user ❌:**
```json
{
  "success": false,
  "message": "Access Denied. Only Admins can access this route."
}
```

## 💡 9️⃣ Why Middleware Is Powerful

Middleware helps keep your backend modular and reusable. Instead of writing authentication logic in every route, you:
- Write it once → `auth-middleware.js`
- Reuse it in multiple routes.

**✅ Benefits:**
- Clean and organized routes.
- Secure backend.
- Easy to maintain and extend.
- Can chain multiple middlewares (e.g. auth → admin → route).

## 🔍 10️⃣ Summary Table

| Concept | Description | File |
|---------|-------------|------|
| **auth-middleware.js** | Verifies JWT token and attaches user info | middleware/auth-middleware.js |
| **admin-middleware.js** | Checks if the user has admin privileges | middleware/admin-middleware.js |
| **Protected Routes** | Routes that require authentication | routes/home-routes.js, routes/admin-routes.js |
| **Authorization** | Determines user access rights | Middleware-based |
| **Role-based Access** | Only users with specific roles can access | adminMiddleware |

## 🧠 In Simple Words

- 🔸 **Authentication** → "Who are you?"
- 🔸 **Authorization** → "What can you do?"
- 🔸 **Middleware** → "Guards" that check identity and permissions before letting you in.
- 🔸 **Protected Routes** → "Private rooms" that need a valid key (token).
