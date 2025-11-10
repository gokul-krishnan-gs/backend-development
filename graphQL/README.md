# 📘 GraphQL Detailed Notes

## 🧠 1. What is GraphQL?

GraphQL is a query language for APIs and a runtime for executing those queries by using a type system that you define for your data.

It was developed by Facebook in 2012 and released publicly in 2015.

### 🔹 GraphQL vs REST API

| Feature | REST API | GraphQL |
|---------|----------|---------|
| Data Fetching | Multiple endpoints (/products, /products/:id) | Single endpoint (/graphql) |
| Data Structure | Fixed response | Flexible – client decides which fields it wants |
| Over-fetching / Under-fetching | Common problem | Solved — returns exactly what client requests |
| Versioning | /v1/, /v2/ endpoints | No versioning required |
| Performance | May require multiple requests | Single request for complex data |

## ⚙️ 2. How GraphQL Works

GraphQL follows a client-driven architecture:

```
Client → Query or Mutation → GraphQL Server (Schema + Resolvers) → Data Source → Response
```

### The Flow:

1. Client sends a query or mutation in GraphQL syntax.
2. Schema validates the structure and field names.
3. Resolvers provide logic on how to fetch or modify data.
4. Server sends exactly the requested fields as a response.

## 🧱 3. Core Building Blocks

### 🔸 a. Schema

The blueprint of your GraphQL API. It defines:
- What data types exist (e.g., Product)
- What queries/mutations clients can perform.

**Example:**

```graphql
type Product {
  id: ID!
  title: String!
  price: Float!
}
```

### 🔸 b. Query

Used to fetch or read data (like GET in REST).

**Example:**

```graphql
type Query {
  products: [Product]!
  product(id: ID!): Product
}
```

### 🔸 c. Mutation

Used to modify data (like POST, PUT, DELETE in REST).

**Example:**

```graphql
type Mutation {
  createProduct(title: String!, price: Float!): Product
  updateProduct(id: ID!, price: Float): Product
  deleteProduct(id: ID!): Boolean
}
```

### 🔸 d. Resolvers

Resolvers are functions that tell GraphQL how to get or modify data. They match the fields in the schema.

**Example:**

```javascript
const resolvers = {
  Query: {
    products: () => products,
  },
  Mutation: {
    createProduct: (_, { title, price }) => { ... }
  }
};
```

### 🔸 e. Apollo Server

Apollo Server is a GraphQL server for Node.js. It helps us easily:
- Define schema and resolvers
- Run the GraphQL server
- Test APIs through a web interface (Apollo Sandbox)

## 🧩 4. Folder Structure

```
graphql-crud/
│
├── server.js                # Main entry (Apollo Server setup)
│
├── graphql/
│   ├── schema.js            # Defines types, queries, mutations
│   └── resolvers.js         # Contains actual logic
│
└── data/
    └── products.js          # Dummy data (mock database)
```

## 💻 5. server.js (Entry Point)

```javascript
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const typeDefs = require('./graphql/schema.js');
const resolvers = require('./graphql/resolvers.js');

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 8000 },
  });

  console.log(`🚀 Server is running at ${url}`);
}

startServer();
```

### 🔍 Explanation:

- Import ApolloServer and startStandaloneServer (built-in HTTP server).
- Connect typeDefs (schema) and resolvers (logic).
- Start server on port 8000.
- Launch automatically in Apollo Sandbox for testing.

## 🧠 6. graphql/schema.js (Schema Definition)

```javascript
const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Product {
    id: ID!
    title: String!
    category: String!
    price: Float!
    inStock: Boolean!
  }

  type Query {
    products: [Product]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(
      title: String!
      category: String!
      price: Float!
      inStock: Boolean!
    ): Product

    deleteProduct(id: ID!): Boolean

    updateProduct(
      id: ID!
      title: String
      category: String
      price: Float
      inStock: Boolean
    ): Product
  }
`;

module.exports = typeDefs;
```

### 🧩 Explanation:

- `type Product` → Defines a model like a database schema.
- `type Query` → Defines readable operations.
- `type Mutation` → Defines write operations (create, update, delete).

## ⚙️ 7. graphql/resolvers.js (Logic Implementation)

```javascript
const products = require("../data/products.js");

const resolvers = {
  Query: {
    products: () => products,
    product: (_, { id }) => products.find((p) => p.id === id),
  },

  Mutation: {
    createProduct: (_, { title, category, price, inStock }) => {
      const newProduct = {
        id: String(products.length + 1),
        title,
        category,
        price,
        inStock,
      };
      products.push(newProduct);
      return newProduct;
    },

    deleteProduct: (_, { id }) => {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return false;
      products.splice(index, 1);
      return true;
    },

    updateProduct: (_, { id, ...updates }) => {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return null;
      const updatedProduct = { ...products[index], ...updates };
      products[index] = updatedProduct;
      return updatedProduct;
    },
  },
};

module.exports = resolvers;
```

### 🧩 Explanation:

- **Query** → For reading products.
- **Mutation** → For creating, updating, deleting.
- Uses simple array operations (find, push, splice).
- No database required — mock data is in products.js.

## 📦 8. data/products.js

Dummy array of product data.

```javascript
const products = [
  { id: "1", title: "Wireless Headphones", category: "Electronics", price: 2999, inStock: true },
  { id: "2", title: "Gaming Mouse", category: "Accessories", price: 1499, inStock: true },
  ...
];
module.exports = products;
```

## 🧪 9. Example Queries (in Apollo Sandbox)

### 🔹 Get All Products

```graphql
query {
  products {
    id
    title
    category
    price
    inStock
  }
}
```

### 🔹 Get Single Product

```graphql
query {
  product(id: "1") {
    title
    price
  }
}
```

### 🔹 Create a Product

```graphql
mutation {
  createProduct(
    title: "Smart Lamp"
    category: "Home"
    price: 1999
    inStock: true
  ) {
    id
    title
    price
  }
}
```

### 🔹 Update a Product

```graphql
mutation {
  updateProduct(id: "1", price: 3499, inStock: false) {
    id
    title
    price
    inStock
  }
}
```

### 🔹 Delete a Product

```graphql
mutation {
  deleteProduct(id: "3")
}
```

## 🔄 10. Execution Flow (Step-by-Step)

1️⃣ Client sends query/mutation →  
2️⃣ Apollo Server receives it →  
3️⃣ Schema validates fields/types →  
4️⃣ Resolver executes logic (fetch or modify data) →  
5️⃣ Server returns the result →  
6️⃣ Client gets only requested fields.

## 🧠 11. Key Benefits of GraphQL

✅ Single endpoint – /graphql  
✅ Strongly typed schema – prevents invalid queries  
✅ No over-fetching – returns exactly what's needed  
✅ Real-time ready – supports subscriptions  
✅ Self-documenting – Apollo Sandbox can auto-document your API

## 🧩 12. Common GraphQL Data Types

| Type | Description | Example |
|------|-------------|---------|
| Int | Integer | 42 |
| Float | Decimal | 3.14 |
| String | Text | "Gokul" |
| Boolean | True/False | true |
| ID | Unique identifier | "123" |
| [Type] | Array of Type | [Product] |

## 🧱 13. Advanced Concepts to Learn Next

| Concept | Description |
|---------|-------------|
| Input Types | Define reusable input objects for cleaner mutation arguments |
| Resolvers per Type | Add nested resolvers for relationships |
| Context | Share data (like authentication info) between resolvers |
| Integration with MongoDB | Replace static data with a real database |
| Subscriptions | For real-time updates (WebSockets) |
| Error Handling | Use try-catch inside resolvers for safety |
| Authentication | Protect mutations using JWT |

## 🧭 14. What You Achieved in This Project

✅ Learned how to create GraphQL server using Apollo  
✅ Implemented CRUD operations without database  
✅ Understood schema, queries, mutations, resolvers  
✅ Successfully tested using Apollo Sandbox  
✅ Gained full knowledge of GraphQL flow and structure
