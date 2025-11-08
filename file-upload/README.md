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
