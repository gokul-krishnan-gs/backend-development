# Authentication & Authorization Guide

## 1. What is Authentication?

Authentication simply means **verifying who the user is**.

**Example:** When you log in using your username and password, the system checks:
- if the username exists in the database, and
- if the entered password matches the hashed password stored there.

If both match, you are an **authenticated user**. That means the system knows you are a real, verified user — not a fake one.

> **Authentication is like saying:** "Yes, this person really is Gokul."

---

## 2. What Happens After Authentication?

Once you're verified, the system gives you a **JWT token** (JSON Web Token).

You can think of this token like a **digital ID card**. It contains your:
- user ID
- username
- role (for example, `user` or `admin`)

But this information is encrypted and signed using a secret key, so no one can change it.

This token is sent back to your browser or client. Next time you want to access some protected page or API, you must send this token in the Authorization header like this:

```
Authorization: Bearer <your_token_here>
```

---

## 3. What is Authorization?

Authorization means **checking what the user is allowed to do**.

**Example:**
- Gokul (role: `"user"`) can access only normal pages.
- The Admin can access admin dashboard, user management, etc.

So, authorization happens **after** authentication.

> **It's like:** "You are verified, but what are you allowed to do inside?"

---

## 4. What is Middleware in This Context?

Middleware is just a **function that runs before your main route handler**. It checks something or does something before deciding whether to continue or stop.

For authentication, we use an `authMiddleware`. For admin-only areas, we use an `adminMiddleware`.

---

## 5. Auth Middleware — How It Works

Let's say a user sends a request to visit `/api/home/welcome`.

1. The request comes with a JWT token in the header.
2. The `authMiddleware` runs before the route.
3. It checks:
   - Is there a token?
   - Is it valid (not expired, not fake)?
4. If valid, it decodes the token using the secret key.
5. It extracts user info (like username, userId, role) and attaches it to `req.userInfo`.
6. Then it calls `next()` — meaning "okay, continue to the next step".

If the token is invalid or missing, it stops right there and returns an error:
> "Access denied — no token provided."

That's how your backend protects certain routes.

---

## 6. Admin Middleware — How It Works

Now let's say you have an admin-only route like `/api/admin/welcome`.

This route has **two middlewares**:
- `authMiddleware` — to make sure the user is logged in.
- `adminMiddleware` — to make sure the user's role is "admin".

The `adminMiddleware` checks:

```javascript
if (req.userInfo.role !== "admin") {
   return res.status(403).json({ message: "Access denied — only admins allowed" });
}
```

- If the role is `admin`, it lets the request continue.
- If not, it blocks the request.

---

## 7. Protected Routes

**Protected routes** are routes that only authenticated users can access. They require a valid JWT token in the header.

**For example:**

```javascript
router.get('/welcome', authMiddleware, (req, res) => {
   res.json({ message: "Welcome Home", user: req.userInfo });
});
```

Here:
- If you have a valid token → you can enter.
- If not → you get "Access Denied".

**For admin-only routes:**

```javascript
router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {
   res.json({ message: "Welcome to Admin Page" });
});
```

---

## 8. The Full Flow Summary

1. **User registers** — password gets hashed using bcrypt and saved in the DB.
2. **User logs in** — password gets verified → JWT token is created and sent.
3. **User visits a protected route** — token is checked by `authMiddleware`.
4. **If the route is admin-only** — role is also checked by `adminMiddleware`.
5. **If all checks pass** — the user is allowed to see the data or perform actions.

---

## 💡 Simple Example Analogy

Think of it like a **movie theatre**:

- **Authentication** → Show your ticket at the entrance gate.
- **Authorization** → The ticket type decides which section you can sit in (normal or VIP).
- **Auth Middleware** → The guard who checks if you even have a ticket.
- **Admin Middleware** → The manager who checks if your ticket allows VIP access.
