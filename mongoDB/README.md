# MongoDB & Mongoose Complete Guide

## 🌿 1. What is MongoDB?

MongoDB is a NoSQL database that stores data in documents (JSON-like format). Each document is stored inside a collection, similar to rows inside tables in SQL.

### 📦 Example:

```json
{
  "name": "Gokul",
  "email": "gokul@gmail.com",
  "age": 22,
  "isActive": true
}
```

---

## 🧩 2. What is Mongoose?

Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. It helps you:

* Define schemas for your data
* Perform CRUD operations easily
* Add validation, default values, and middleware

---

## ⚙️ 3. Connecting MongoDB using Mongoose

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://<username>:<password>@<cluster-url>/')
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.log(err));
```

✅ Always handle connection success and failure properly.  
✅ Use `.env` file to hide credentials.

---

## 📘 4. Schema & Model

### Schema — structure of the document

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  isActive: Boolean,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});
```

### Model — interface to interact with the collection

```javascript
const User = mongoose.model('User', userSchema);
```

📌 The first argument (`'User'`) automatically maps to a collection name "users" in MongoDB.

---

## 🧑‍💻 5. CRUD Operations

### ➕ Create

```javascript
const newUser = await User.create({
  name: "Rachel",
  email: "rachel@gmail.com",
  age: 20,
  isActive: true,
  tags: ['developer', 'learner']
});
```

OR

```javascript
const user = new User({ name: "Admin", email: "admin@gmail.com" });
await user.save();
```

### 🔍 Read (Find)

```javascript
const users = await User.find();                   // all users
const activeUsers = await User.find({ isActive: true }); // filter
const oneUser = await User.findById("ID_HERE");    // by ID
```

✅ Select specific fields:

```javascript
const namesOnly = await User.find().select('name -_id');
```

✅ Skip & Limit:

```javascript
const skipUsers = await User.find().skip(2).limit(3);
```

✅ Sort:

```javascript
const sorted = await User.find().sort({ age: -1 });  // -1 = descending
```

✅ Count:

```javascript
const total = await User.countDocuments({ isActive: false });
```

### ✏️ Update

```javascript
const updated = await User.findByIdAndUpdate("ID_HERE", {
  $set: { age: 25 },
  $push: { tags: 'updated' }
}, { new: true });
```

🧠 `{ new: true }` returns the updated document instead of the old one.

### ❌ Delete

```javascript
const deleted = await User.findByIdAndDelete("ID_HERE");
```

---

## 🔒 6. Closing the Database Connection

```javascript
await mongoose.connection.close();
console.log("Database connection closed successfully");
```

---

## 🧠 7. Mongoose Methods Summary

| Operation | Method | Description |
|-----------|--------|-------------|
| Create | `Model.create()` / `new Model().save()` | Adds new document |
| Read | `Model.find()` / `Model.findById()` | Fetches data |
| Update | `Model.findByIdAndUpdate()` | Updates document |
| Delete | `Model.findByIdAndDelete()` | Removes document |
| Count | `Model.countDocuments()` | Counts total docs |
| Sort | `.sort({ field: 1/-1 })` | Sort ascending/descending |
| Select | `.select('field')` | Choose which fields to return |

---

## 💡 8. Real-World Uses of Mongoose

* User authentication systems
* E-commerce product management
* Blog posts, comments, analytics
* Task management or habit tracker apps
* Real-time dashboards (connected with Express.js)
