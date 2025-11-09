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
* 

# 🧠 MongoDB Intermediate Notes

## 📘 What is Aggregation?

* Aggregation in MongoDB is used to process and transform data in a collection.
* It allows you to perform complex data analysis like filtering, grouping, sorting, and computing totals — similar to SQL's `GROUP BY` and `JOIN`.
* It uses a pipeline concept, where data passes through multiple stages, each stage transforming the data.

## ⚙️ Common Aggregation Pipeline Stages

### 1. $match

Filters documents based on certain conditions — works like `find()`, but inside aggregation.

```javascript
{ $match: { inStock: true, price: { $gte: 100 } } }
```

✅ **Use Case:** Filter products that are in stock and priced above ₹100.

### 2. $group

Groups documents by a field and performs calculations like average, count, sum, etc.

```javascript
{
  $group: {
    _id: "$category",
    avgPrice: { $avg: "$price" },
    totalItems: { $sum: 1 },
    totalValue: { $sum: "$price" }
  }
}
```

✅ **Use Case:** Calculate average price, total items, and total price per category.

### 3. $sort

Sorts documents in ascending (1) or descending (-1) order.

```javascript
{ $sort: { avgPrice: -1 } }
```

✅ **Use Case:** Sort products or categories by average price.

### 4. $project

Selects specific fields and can also create computed fields.

```javascript
{
  $project: {
    _id: 0,
    name: 1,
    price: 1,
    discountedPrice: { $multiply: ["$price", 0.9] }
  }
}
```

✅ **Use Case:** Show only product name, price, and apply a 10% discount dynamically.

### 5. $limit and $skip

Used for pagination.

```javascript
{ $skip: 10 }, { $limit: 5 }
```

✅ **Use Case:** Skip the first 10 documents and get the next 5 (useful in APIs).

### 6. $lookup

Used for joining two collections (similar to SQL JOIN).

```javascript
{
  $lookup: {
    from: "categories",
    localField: "categoryId",
    foreignField: "_id",
    as: "categoryDetails"
  }
}
```

✅ **Use Case:** Fetch category details for each product.

### 7. $unwind

Deconstructs an array field — outputs one document for each array element.

```javascript
{ $unwind: "$tags" }
```

✅ **Use Case:** Get individual tags of a product for tag-based analytics.

## 🧮 Example: Product Analytics

```javascript
const result = await Product.aggregate([
  { $match: { inStock: true, price: { $gte: 100 } } },
  {
    $group: {
      _id: "$category",
      avgPrice: { $avg: "$price" },
      totalPrice: { $sum: "$price" },
      highestPrice: { $max: "$price" },
      lowestPrice: { $min: "$price" }
    }
  },
  {
    $project: {
      category: "$_id",
      _id: 0,
      avgPrice: 1,
      totalPrice: 1,
      priceRange: { $subtract: ["$highestPrice", "$lowestPrice"] }
    }
  }
]);
```

✅ **Output:** Summary of each category with average price, total price, and price range.

## 🔗 Object Referencing & Population

When you work with multiple collections, you often connect them using ObjectId references — similar to foreign keys in SQL.

### 📄 Example: Two Models

**User Model**

```javascript
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});
```

**Product Model**

```javascript
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // reference to User model
  }
});
```

### 💡 Why Use ObjectId References?

* Avoids data duplication.
* Makes relationships between documents.
* Enables population — automatically fetch related data.

### 🔍 Populating Data

```javascript
const products = await Product.find().populate('owner', 'name email');
```

✅ This replaces the `owner` ObjectId with the full User object (with only `name` and `email`).


# 🧩  Aggregation in MongoDB

## 🔹 What is Aggregation?

Aggregation means collecting and processing data to get useful information. It's like doing data analysis directly in MongoDB — for example:

* Finding total price
* Counting products
* Getting average, minimum, or maximum price

Aggregation uses a pipeline (a series of steps). Each step changes the data and sends it to the next step.

## 🔹 Common Aggregation Stages

| Stage | Meaning | Example |
|-------|---------|---------|
| `$match` | Filters data (like a WHERE clause) | `{ $match: { category: "Electronics" } }` |
| `$group` | Groups data and does calculations | `{ $group: { _id: "$category", avgPrice: { $avg: "$price" } } }` |
| `$sort` | Sorts the result | `{ $sort: { avgPrice: -1 } }` |
| `$project` | Shows only selected fields or new calculated fields | `{ $project: { name: 1, priceWithTax: { $multiply: ["$price", 1.18] } } }` |
| `$lookup` | Joins two collections | Joins `users` with `products` |
| `$unwind` | Breaks an array into separate documents | `{ $unwind: "$tags" }` |

## 🔹 Example 1 — Basic Aggregation

```javascript
db.products.aggregate([
  { $match: { inStock: true } },
  { $group: {
      _id: "$category",
      avgPrice: { $avg: "$price" },
      totalPrice: { $sum: "$price" },
      count: { $sum: 1 }
  }}
]);
```

✅ **What it does:**
* Takes only products that are in stock.
* Groups them by category.
* Finds average, total, and count of products in each category.

## 🔹 Example 2 — Add a calculated field

```javascript
{ 
  $project: { 
    _id: 0, 
    category: "$_id",
    priceRange: { $subtract: ["$maxPrice", "$minPrice"] } 
  } 
}
```

✅ **What it does:** shows how much difference between max and min price.

## 🔹 Example 3 — Joining Two Collections

Use `$lookup` to join related data:

```javascript
{
  $lookup: {
    from: "users",
    localField: "owner",
    foreignField: "_id",
    as: "ownerDetails"
  }
}
```

✅ **Meaning:** Join the `users` collection with the `products` collection where `product.owner` = `user._id`.

---

# 👥 2. Populating in Mongoose

## 🔹 What is Population?

Population is a Mongoose feature used to get related data from another collection easily.

It works similar to `$lookup`, but it's used directly with Mongoose models.

## 🔹 Example — Object Referencing

**User Model**

```javascript
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});
```

**Product Model**

```javascript
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
```

✅ Here, `owner` stores the user's ObjectId (reference to the User model).

## 🔹 Saving Data

```javascript
const user = await User.create({ name: "Gokul", email: "gokul@gmail.com" });
const product = await Product.create({
  name: "Laptop",
  price: 50000,
  owner: user._id
});
```

## 🔹 Populating Data

```javascript
const products = await Product.find().populate('owner', 'name email');
```

✅ **What happens:**
* Mongoose replaces the `owner` ObjectId with the actual User document.
* Only shows the user's `name` and `email`.

**Output:**

```json
{
  "name": "Laptop",
  "price": 50000,
  "owner": {
    "name": "Gokul",
    "email": "gokul@gmail.com"
  }
}
```

## 🔹 Why Use Populate?

✅ Makes data easier to read.  
✅ Avoids writing long `$lookup` queries.  
✅ Saves time when building APIs.

---

# 🧠 Summary

| Concept | Meaning | Example |
|---------|---------|---------|
| **Aggregation** | Analyze and transform data in MongoDB | `$match`, `$group`, `$project`, `$lookup` |
| **Population** | Mongoose shortcut to fetch related documents | `.populate('owner', 'name email')` |
| **ObjectId Reference** | Connects two collections | `owner: { type: ObjectId, ref: "User" }` |
| **$lookup vs populate** | `$lookup` used in MongoDB aggregation, `populate` used in Mongoose | `$lookup` → DB side, `populate` → Mongoose side |
