# Image Upload System with Cloudinary

Uploading and managing media files is a core part of modern web applications. This system allows:

- Admins to upload images to the cloud (Cloudinary)
- Users to view these uploaded images securely

The system integrates:

- **Cloudinary** for cloud storage and CDN hosting
- **Multer** for file handling on the server
- **MongoDB** for storing image metadata
- **JWT authentication** for user access control
- **Express.js** for routing and middleware management

## 🧩 2. Folder Structure Explained

```
project/
│
├── config/                → All service configurations (Cloudinary, DB)
│   └── cloudinary.js
│
├── controllers/           → Business logic (upload, fetch)
│   └── image-controller.js
│
├── helpers/               → Reusable utility functions
│   └── cloudinary-helper.js
│
├── middleware/            → Custom middlewares for auth, admin, uploads
│   ├── auth-middleware.js
│   ├── admin-middleware.js
│   └── upload-middleware.js
│
├── models/                → Mongoose schemas for MongoDB
│   └── Image.js
│
├── routes/                → API endpoints
│   └── image-routes.js
│
├── uploads/               → Temporary local storage for images (before Cloudinary)
│
├── .env                   → Environment variables (secrets & keys)
├── server.js              → App entry point
└── package.json
```

### 📘 Why this structure matters:

- It keeps the code modular
- Each file has a single responsibility
- Easy to maintain and scale in large projects

## 🧾 3. Image Schema (MongoDB Model)

```javascript
const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);
```

### 🔍 Detailed Explanation:

- **url** → Stores the secure URL returned by Cloudinary  
  Example: `https://res.cloudinary.com/demo/image/upload/v1234567/sample.jpg`

- **publicId** → Unique Cloudinary image identifier (needed to delete/update the image later)

- **uploadedBy** → Links the image to the user who uploaded it

- **timestamps** → Adds `createdAt` and `updatedAt` automatically

🧩 This schema ensures every uploaded image is traceable and manageable from the database.

## ⚙️ 4. Cloudinary Configuration (config/cloudinary.js)

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
```

### 🧠 What this does:

- Connects your backend with your Cloudinary account using credentials stored in `.env`
- Without this config, uploads won't be authenticated or stored properly
- `cloudinary.v2` is the modern version of Cloudinary's SDK

✅ **Good practice:** Always keep these credentials hidden inside `.env` — never commit them to GitHub.

## 🧰 5. Cloudinary Helper (helpers/cloudinary-helper.js)

```javascript
const cloudinary = require('../config/cloudinary.js');

async function uploadToCloudinary(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
        console.error('Error while uploading to cloudinary...', error);
        throw new Error('Error while uploading to cloudinary');
    }
}

module.exports = { uploadToCloudinary };
```

### 🧠 Explanation:

- Encapsulates Cloudinary logic into a single function
- Uploads image file from the local path (saved by Multer)
- Returns only the essential info:
  - **url** → For frontend display
  - **publicId** → For managing the image later
- Any errors during upload are caught and handled gracefully

💡 **Why use a helper?**  
It makes your code cleaner — the controller doesn't need to know how Cloudinary works internally.

## 🧱 6. Multer Middleware (middleware/upload-middleware.js)

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

function checkFileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload images only'));
    }
}

module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});
```

### 🧠 Explanation:

- **Purpose:** Handle file uploads from the client before sending to Cloudinary

- **Storage:**
  - Saves uploaded files temporarily to the `/uploads` folder
  - Renames files with timestamps to avoid duplication

- **File Filter:** Ensures only image MIME types are accepted

- **Limits:** Restricts file size to 5MB

### 🧩 Flow:

1. User selects image → sent to backend
2. Multer saves it locally
3. Cloudinary helper uploads it to cloud
4. Local file can be deleted after successful upload

## 🚦 7. Routes (routes/image-routes.js)

```javascript
const express = require('express');
const authMiddleWare = require('../middleware/auth-middleware.js');
const adminMiddleWare = require('../middleware/admin-middleware.js');
const uploadMiddleWare = require('../middleware/upload-middleware.js');
const { uploadImage, fetchImages } = require('../controllers/image-controller.js');

const router = express.Router();

router.post('/upload', authMiddleWare, adminMiddleWare, uploadMiddleWare.single('image'), uploadImage);
router.get('/get', authMiddleWare, fetchImages);

module.exports = router;
```

### 🧠 Explanation:

- **`/upload`** → Only authenticated admins can upload images
  - `authMiddleware` → verifies JWT token
  - `adminMiddleware` → checks if user has admin role
  - `uploadMiddleware.single('image')` → parses the image file

- **`/get`** → Any authenticated user can fetch image data

✅ This is a clean example of **layered security:**  
Authentication → Role check → Upload handler → Controller

## 🎮 8. Image Controller (controllers/image-controller.js)

```javascript
const Image = require('../models/Image.js');
const { uploadToCloudinary } = require('../helpers/cloudinary-helper.js');
const fs = require('fs');

async function uploadImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required, please upload an image'
            });
        }

        const { url, publicId } = await uploadToCloudinary(req.file.path);

        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });

        await newlyUploadedImage.save();

        // Optional: Delete local file
        // fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newlyUploadedImage
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
}

async function fetchImages(req, res) {
    try {
        const images = await Image.find().populate('uploadedBy', 'username');
        res.status(200).json({
            success: true,
            data: images
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
}

module.exports = { uploadImage, fetchImages };
```

### 🧠 Explanation:

**uploadImage flow:**
1. Check if a file is uploaded
2. Upload it to Cloudinary via helper
3. Get Cloudinary's `url` and `publicId`
4. Save metadata in MongoDB (linking it to the uploader)
5. (Optional) Delete the temporary file using `fs.unlinkSync()`

**fetchImages flow:**
1. Fetches all images from MongoDB
2. Returns them as JSON to frontend
3. `.populate('uploadedBy', 'username')` can show uploader's username

## 🖥️ 9. Server Setup (server.js)

```javascript
require('dotenv').config();
const express = require('express');
const connectDB = require('./database/db.js');

const authRoutes = require('./routes/auth-routes.js');
const homeRoutes = require('./routes/home-routes.js');
const adminRoutes = require('./routes/admin-routes.js');
const uploadImageRoutes = require('./routes/image-routes.js');

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);

app.listen(PORT, () => console.log(`Server is running🔥`));
```

### 🧠 Explanation:

- Loads environment variables
- Connects to MongoDB
- Sets up middleware for JSON parsing
- Mounts all route modules under `/api/` prefix
- Starts the Express server

## 🔐 10. Security Practices

✅ **Environment variables** — never expose your API keys  
✅ **File validation** — check mimetype to block unsafe files  
✅ **Role-based access** — only admins upload  
✅ **Rate limiting** (optional) — to prevent spam uploads  
✅ **Error handling** — return structured JSON responses

## 🌐 11. API Endpoints Overview

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/image/upload` | Admin only | Upload image to Cloudinary |
| GET | `/api/image/get` | Authenticated users | Fetch all uploaded images |

### delete images and change password

## 🧩 1. deleteImage Function — Detailed Explanation

```javascript
async function deleteImage(req, res) {
  try {
    const getCurrentIdOfImageToBeDelted = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getCurrentIdOfImageToBeDelted);

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image not found"
      });
    }

    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Cant delete , because it is not uploaded by you!"
      });
    }

    await cloudinary.uploader.destroy(image.publicId);

    await Image.findByIdAndDelete(getCurrentIdOfImageToBeDelted);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `something went wrong! Please try again`
    });
  }
}
```

### 🧠 Step-by-Step Explanation

| Step | Description |
|------|-------------|
| 1. Extract Image ID from URL | `req.params.id` → The image ID is sent in the route parameter (`DELETE /api/image/:id`). |
| 2. Get User ID from Token | `req.userInfo.userId` → Comes from your authMiddleware (decoded JWT). This identifies the logged-in user. |
| 3. Find Image in Database | `Image.findById()` searches the MongoDB collection for the image with that ID. |
| 4. Validate Image Exists | If image not found → return error 400 Image not found. |
| 5. Check Ownership | If the logged-in user didn't upload it → return 403 Forbidden. This prevents others from deleting your images. |
| 6. Delete from Cloudinary | `cloudinary.uploader.destroy(image.publicId)` removes the image from Cloudinary storage. |
| 7. Delete from MongoDB | `Image.findByIdAndDelete()` removes the image document from the database. |
| 8. Send Success Response | Return a JSON response: Image deleted successfully. |
| 9. Catch Errors | Any unexpected errors go to the catch block and return 500 Internal Server Error. |

### ✅ Purpose
This function ensures secure deletion of an image — only the uploader can delete it, and it's removed from both Cloudinary and MongoDB.

---

## 🔐 2. changePassword Function — Detailed Explanation

```javascript
async function changePassword(req, res) {
  try {
    const userId = req.userInfo.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password! Please Try Again"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfuly"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Internal Error"
    });
  }
}
```

### 🧠 Step-by-Step Explanation

| Step | Description |
|------|-------------|
| 1. Get User ID from Token | The logged-in user's ID is taken from `req.userInfo.userId`. |
| 2. Extract Passwords | The user sends `{ oldPassword, newPassword }` in the request body. |
| 3. Find User in DB | Using `User.findById()` to fetch the user document. |
| 4. Check User Exists | If not found → return 400 User not found. |
| 5. Verify Old Password | Compare entered old password with stored hash using `bcrypt.compare()`. |
| 6. If Incorrect, Reject | If old password doesn't match → send error message. |
| 7. Hash New Password | Generate a new salt using `bcrypt.genSalt(10)` and hash the new password. |
| 8. Update User Password | Replace old hash with new hash and save user document. |
| 9. Send Success Message | Return 200 OK and confirmation message. |
| 10. Handle Errors | Any unexpected issue → log error + return 500 Internal Server Error. |

### ✅ Purpose
This ensures secure password updating — the user must first confirm their old password before changing it. Hashing keeps the new password safe in the database.

---

## 🧩 3. Router Setup

```javascript
router.delete('/:id', authMiddleWare, adminMiddleWare, deleteImage);
```

### 🔍 Explanation

- **authMiddleWare** → Ensures the user is logged in and JWT is valid.
- **adminMiddleWare** → Allows only admins to access or adds extra validation logic.
- **deleteImage** → The controller function to delete the image securely.

---

## 🧱 Summary

| Feature | Purpose | Security |
|---------|---------|----------|
| Delete Image | Allows users to remove their own uploaded images. | Prevents unauthorized deletions using ownership check. |
| Change Password | Lets users securely update their password. | Uses bcrypt for hashing and requires old password validation. |

# 🧩 Fetch Images with Sorting & Pagination

```javascript
async function fetchImages(req, res) {
  try {
    // sorting and pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find()
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `something went wrong! Please try again`
    });
  }
}
```

## ⚙️ Step-by-Step Explanation

### 1️⃣ Pagination Parameters

```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 5;
```

* Reads `page` and `limit` from the query string. Example:

```
GET /api/images?page=2&limit=10
```

* Defaults:
  * `page = 1` → First page.
  * `limit = 5` → Show 5 items per page.

### 2️⃣ Calculate Skip (offset)

```javascript
const skip = (page - 1) * limit;
```

* Determines how many documents to skip before fetching the current page.
  * Example:
    * Page 1 → skip 0
    * Page 2 → skip 5
    * Page 3 → skip 10

This ensures pagination displays only the requested set of images.

### 3️⃣ Sorting Parameters

```javascript
const sortBy = req.query.sortBy || 'createdAt';
const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
```

* Lets user choose which field to sort by.
* Sort order can be:
  * `"asc"` → ascending order
  * `"desc"` → descending order

Example query:

```
GET /api/images?sortBy=title&sortOrder=asc
```

### 4️⃣ Count Total Documents

```javascript
const totalImages = await Image.countDocuments();
const totalPages = Math.ceil(totalImages / limit);
```

* Counts total number of images in DB.
* Calculates total pages based on limit per page.

Example:
* 42 images, limit = 5 → totalPages = 9

### 5️⃣ Build Sort Object

```javascript
const sortObj = {};
sortObj[sortBy] = sortOrder;
```

This dynamically creates the sort condition for MongoDB. Example:

```javascript
{ createdAt: -1 }   // Sort newest first
{ title: 1 }        // Sort alphabetically ascending
```

### 6️⃣ Fetch Paginated & Sorted Data

```javascript
const images = await Image.find()
  .sort(sortObj)
  .skip(skip)
  .limit(limit);
```

This query: ✅ sorts ✅ skips unnecessary records ✅ limits results → Efficient + fast response.

### 7️⃣ Response Sent to Frontend

```javascript
res.status(200).json({
  success: true,
  currentPage: page,
  totalPages: totalPages,
  totalImages: totalImages,
  data: images
});
```

The response gives full pagination data, e.g.:

```json
{
  "success": true,
  "currentPage": 2,
  "totalPages": 9,
  "totalImages": 42,
  "data": [ ... ]
}
```

This helps the frontend easily display:
* Pagination buttons
* Page numbers
* Sorting dropdowns

### 8️⃣ Error Handling

```javascript
catch (error) {
  console.error(error);
  res.status(500).json({
    success: false,
    message: `something went wrong! Please try again`
  });
}
```

Catches and reports internal errors gracefully without crashing the server.

## 🧱 Example API Requests

| Request | Description |
|---------|-------------|
| `/api/images` | Default: page=1, limit=5, sort by `createdAt` descending |
| `/api/images?page=2&limit=10` | Fetch second page with 10 images |
| `/api/images?sortBy=title&sortOrder=asc` | Sort alphabetically by title |
| `/api/images?page=3&sortBy=size&sortOrder=desc` | Fetch page 3 sorted by size descending |

## 🎯 Purpose

This function makes your backend scalable and frontend-friendly — it ensures that when your image gallery grows to hundreds or thousands of items:
* The user only loads a few per page.
* Data stays fast and responsive.
* Sorting helps in easily finding the right image.
