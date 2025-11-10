# TypeScript Backend Development Guide

## 🧠 WHY USE TYPESCRIPT IN BACKEND?

| Feature | Description |
|---------|-------------|
| Static Typing | Catches bugs before running your code |
| Better IntelliSense | Autocompletion + parameter hints |
| Code Scalability | Makes large backend apps easy to maintain |
| Fewer Runtime Errors | TS ensures type safety at compile-time |
| Modern Syntax Support | ES6+ features out of the box |

## ⚙️ 1️⃣ INITIAL SETUP (Step-by-Step)

### 1. Create new folder

```bash
mkdir ts-backend
cd ts-backend
```

### 2. Initialize npm

```bash
npm init -y
```

### 3. Install TypeScript + Node types

```bash
npm install typescript ts-node @types/node --save-dev
```

### 4. Create a tsconfig.json

```bash
npx tsc --init
```

### 5. Important settings in tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

**🧩 Meaning:**
- `rootDir`: Where your .ts files live
- `outDir`: Where compiled .js files go
- `esModuleInterop`: Allows both import and require styles
- `strict`: Enables full type safety

## ⚙️ 2️⃣ SETTING UP EXPRESS WITH TYPESCRIPT

### Install packages

```bash
npm install express cors dotenv
npm install --save-dev @types/express @types/cors
```

### Folder structure

```
ts-backend/
│
├── src/
│   ├── server.ts
│   └── routes/
│       └── userRoutes.ts
│
├── tsconfig.json
└── package.json
```

### ✳️ src/server.ts

```typescript
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to TypeScript Backend 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**🧠 Notes:**
- `Request` and `Response` types are imported for safety
- If you mistype something (like `req.params.idd`), TS catches it immediately

## 🧩 3️⃣ ADDING MONGODB (WITH MONGOOSE)

### Install dependencies

```bash
npm install mongoose
npm install --save-dev @types/mongoose
```

### File: src/config/db.ts

```typescript
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
```

**🧠 Note:**
- The `as string` ensures TypeScript knows `process.env.MONGO_URI` is a string

### File: src/models/User.ts

```typescript
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  age: number;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true }
});

export default mongoose.model<IUser>("User", userSchema);
```

**🧠 Notes:**
- We define an interface `IUser` to describe data shape
- Mongoose model uses `<IUser>` to ensure type safety

### File: src/server.ts (updated)

```typescript
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

app.get("/users", async (req: Request, res: Response): Promise<void> => {
  const users = await User.find();
  res.json(users);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
```

## ⚙️ 4️⃣ RUN THE SERVER

### Run directly with TypeScript

```bash
npx ts-node src/server.ts
```

### Or compile and run JS output

```bash
npx tsc
node dist/server.js
```

## 💡 EXTRA TYPE NOTES

| Concept | Example | Meaning |
|---------|---------|---------|
| Interface | `interface IUser { name: string }` | Describes object structure |
| Type Annotation | `let x: number = 10` | Defines variable type |
| Optional field | `email?: string` | May or may not exist |
| Function Type | `(a: number, b: number): number` | Input + Output types |
| Generic | `Array<string>` | Type-safe collections |
| Union Type | `string \| number` | Can be either type |

## 🧠 BACKEND FILE STRUCTURE FOR REAL PROJECTS

```
src/
├── config/
│   └── db.ts
├── models/
│   └── User.ts
├── routes/
│   └── userRoutes.ts
├── controllers/
│   └── userController.ts
├── middleware/
│   └── authMiddleware.ts
├── graphql/
│   ├── schema.ts
│   └── resolvers.ts
└── server.ts
```

Each file has strict types, making your app predictable, safe, and easy to debug.
