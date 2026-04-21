# 🌱 Urban Farming Platform — Backend API

A robust, production-ready REST API backend for an **Interactive Urban Farming Platform** that connects individuals, urban farmers, and gardening enthusiasts in metropolitan areas. Built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**.

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Modules](#-api-modules)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Seeding the Database](#-seeding-the-database)
- [API Documentation](#-api-documentation)
- [Running Tests](#-running-tests)
- [Benchmark Report](#-benchmark-report)
- [Roles & Permissions](#-roles--permissions)
- [API Response Format](#-api-response-format)
- [Rate Limiting](#-rate-limiting)
- [Contributing](#-contributing)

---

## 🌍 About the Project

The **Urban Farming Platform** is a backend API system designed to support a community-driven urban agriculture ecosystem. It enables city dwellers to:

- **Rent garden plots** from local farmers and grow their own food
- **Buy and sell fresh organic produce** through a digital marketplace
- **Track plant growth** in real time — from seedling to harvest
- **Share farming knowledge** through a community forum
- **Verify sustainability** via organic certification for vendors

The platform is built around three core roles — **Admin**, **Vendor (Urban Farmer)**, and **Customer** — each with clearly defined permissions and access control. Security, performance, and developer experience are first-class concerns throughout the architecture.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login with **JWT-based authentication**
- **Role-based access control (RBAC)** — Admin, Vendor, Customer
- Passwords hashed with **bcrypt** (salt rounds: 10)
- Tokens expire after **7 days**
- Rate limiting on sensitive auth routes to prevent brute force attacks

### 🏪 Vendor Management
- Vendors can register and create farm profiles
- Admin can approve or reject vendor applications
- Vendors can manage their farm details and certification status

### 🥬 Produce Marketplace
- Vendors can list organic produce for sale
- Public browsing with **pagination** and **category filtering**
- Vendors can create, update, and delete their listings
- Inventory automatically decrements when an order is placed

### 📦 Order System
- Customers can place orders on available produce
- Orders use **database transactions** to ensure stock consistency
- Vendors can update order status: `PENDING → CONFIRMED → DELIVERED → CANCELLED`
- Paginated order history for both customers and vendors

### 🌱 Farm Space Rental
- Vendors can list garden plots available for rent
- Public search with **location-based filtering** (case-insensitive)
- Vendors can toggle availability on/off
- Paginated listing with size and price details

### 🏅 Sustainability Certification
- Vendors can submit certifications from organic certifying agencies
- Admin reviews and **approves or rejects** certifications
- Certification status is reflected on vendor profiles

### 💬 Community Forum
- Any logged-in user (Vendor or Customer) can create posts
- Public browsing — no login required to read posts
- Post owners and Admins can delete posts
- Paginated post listing with user attribution

### 🌿 Plant Tracking
- Customers can track their plants' **growth stages** and **health status**
- Valid growth stages: `SEEDLING → VEGETATIVE → FLOWERING → FRUITING → HARVEST`
- Valid health statuses: `HEALTHY, DISEASED, PEST_AFFECTED, WILTING, DEAD`
- Full CRUD — add, view, update, and delete plant records
- Admins can view all platform-wide plant tracking data

### 👑 Admin Dashboard
- View **real-time platform statistics** (users, vendors, orders, produce, posts, certs)
- Manage all users — suspend, ban, reactivate, or delete accounts
- Admin accounts are protected from deletion or status changes
- Approve vendors and oversee all orders across the platform

### ⚡ Performance & Reliability
- **Parallel database queries** with `Promise.all()` for faster list endpoints
- **Selective field returns** using Prisma `select` to minimize payload size
- **Pagination** on all list endpoints to prevent memory overload
- Centralized error handler ensures no uncaught crashes
- Standardized JSON response format across all endpoints

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js v24 |
| Framework | Express.js v5 |
| ORM | Prisma v6 |
| Database | PostgreSQL |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcrypt |
| API Documentation | Swagger UI (swagger-jsdoc + swagger-ui-express) |
| Rate Limiting | express-rate-limit |
| Seeding | @faker-js/faker |
| Dev Server | nodemon |
| Testing | Postman Collection (131 requests) |
| Benchmarking | autocannon |

---

## 📁 Project Structure

```
UrbanFarming/
├── docs/
│   ├── postman_collection.json     # Complete Postman test suite
│   ├── API_STRATEGY.md             # API response & performance notes
│   └── BENCHMARK.md                # API benchmark report
├── generated/
│   └── prisma/                     # Auto-generated Prisma client
├── prisma/
│   ├── migrations/                 # Database migration history
│   └── schema.prisma               # Database schema definition
├── scripts/
│   └── seed.js                     # Database seeder script
├── src/
│   ├── config/
│   │   └── db.js                   # Prisma client instance
│   ├── controllers/
│   │   ├── adminController.js      # Admin module logic
│   │   ├── authController.js       # Auth (register/login/logout)
│   │   ├── certController.js       # Sustainability certifications
│   │   ├── forumController.js      # Community forum posts
│   │   ├── orderController.js      # Order management
│   │   ├── plantController.js      # Plant tracking
│   │   ├── productController.js    # Produce marketplace
│   │   ├── rentalController.js     # Farm space rentals
│   │   └── vendorController.js     # Vendor profiles
│   ├── docs/
│   │   └── swagger.js              # Swagger/OpenAPI configuration
│   ├── middlewares/
│   │   ├── authMiddleware.js       # JWT verification & role authorization
│   │   ├── errorHandler.js         # Global error handler
│   │   └── rateLimiter.js          # Auth route rate limiting
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── certRoutes.js
│   │   ├── forumRoutes.js
│   │   ├── marketplaceRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── plantRoutes.js
│   │   ├── rentalRoutes.js
│   │   └── vendorRoutes.js
│   └── utils/
│       └── apiResponse.js          # Standardized response helpers
├── .env                            # Environment variables (not committed)
├── .gitignore
├── package.json
├── prisma.config.ts                # Prisma configuration
└── server.js                       # App entry point
```

---

## 🗄 Database Schema

The platform uses **8 database models**:

| Model | Description |
|---|---|
| `User` | All platform users (Admin, Vendor, Customer) |
| `VendorProfile` | Extended profile for Vendor users |
| `Produce` | Marketplace product listings |
| `RentalSpace` | Garden plots available for rent |
| `Order` | Customer purchase records |
| `CommunityPost` | Forum posts |
| `SustainabilityCert` | Organic certification submissions |
| `PlantTracking` | Customer plant growth records |

---

## 📡 API Modules

| Module | Base Route | Auth Required |
|---|---|---|
| Authentication | `/api/auth` | Partial |
| Vendors | `/api/vendors` | Yes |
| Produce / Marketplace | `/api/produce` | Partial |
| Orders | `/api/orders` | Yes |
| Rentals | `/api/rentals` | Partial |
| Certifications | `/api/certs` | Yes |
| Community Forum | `/api/forum` | Partial |
| Plant Tracking | `/api/plants` | Yes |
| Admin | `/api/admin` | Admin only |
| Swagger Docs | `/api/docs` | No |

---

## ✅ Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **PostgreSQL** v13 or higher — [Download](https://www.postgresql.org/download/)
- **npm** v8 or higher (comes with Node.js)
- **Git** — [Download](https://git-scm.com)

---

## 🚀 Installation & Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/urban-farming-platform.git
cd urban-farming-platform
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Create Your PostgreSQL Database

Open your PostgreSQL client (pgAdmin, psql, or DBeaver) and create a new database:

```sql
CREATE DATABASE "urbanFarmingDB";
```

### Step 4 — Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then open `.env` and fill in your values (see [Environment Variables](#-environment-variables) below).

### Step 5 — Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all database tables based on the schema.

### Step 6 — Generate Prisma Client

```bash
npx prisma generate
```

### Step 7 — Seed the Database

```bash
npm run seed
```

This creates:
- 1 Admin account
- 10 Vendor accounts with profiles
- 100 Produce listings
- 5 Customer accounts
- 20 Community posts
- 10 Rental spaces
- 10 Sustainability certifications
- 10 Plant tracking entries

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with these values:

```env
# Server
PORT=4000

# Database
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/urbanFarmingDB?schema=public"

# JWT
JWT_SECRET="your_super_secret_jwt_key_here"
```

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server runs on | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/urbanFarmingDB?schema=public` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Any long random string |

> ⚠️ **Never commit your `.env` file to version control.** It is already included in `.gitignore`.

---

## ▶️ Running the Project

### Development Mode (with auto-restart)

```bash
npm start
```

Uses `nodemon` — automatically restarts the server when files change.

### Production Mode

```bash
npm run server
```

Uses `node` directly — no auto-restart.

Once running, you should see:

```
📄 Swagger docs available at: http://localhost:4000/api/docs
Server running at port: 4000
```

---

## 🌱 Seeding the Database

The seeder populates the database with realistic test data.

```bash
npm run seed
```

### Seeded Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@urbanfarming.com` | `admin123` |
| Vendor | Random faker emails | `vendor123` |
| Customer | Random faker emails | `customer123` |

> 💡 To find vendor/customer emails, run `npx prisma studio` and browse the User table.

### Resetting & Re-seeding

The seeder automatically clears all existing data before inserting fresh records. Simply run:

```bash
npm run seed
```

> ⚠️ This **deletes all existing data**. Do not run in production.

---

## 📚 API Documentation

Interactive Swagger documentation is available when the server is running:

```
http://localhost:4000/api/docs
```

The Swagger UI allows you to:
- Browse all available endpoints
- See request/response schemas
- Test endpoints directly from the browser using your JWT token

To authenticate in Swagger:
1. Call `POST /api/auth/login` to get your token
2. Click the **Authorize** button (🔒) at the top right
3. Enter: `Bearer YOUR_TOKEN_HERE`
4. Click **Authorize** — all subsequent requests will use your token

---

## 🧪 Running Tests

The project includes a complete **Postman test collection** with 131 requests covering all endpoints, roles, and edge cases.

### Import the Collection

1. Open **Postman**
2. Click **Import**
3. Select `docs/postman_collection.json`
4. Click **Import**

### Run the Full Test Suite

**Step 1** — Run the Setup folder first (auto-populates all tokens and IDs):

```
0. Setup — Register & Login All Roles
```

Run each request in order:
1. Register Vendor
2. Register Customer
3. Login Admin → saves `adminToken`
4. Login Vendor → saves `vendorToken`
5. Login Customer → saves `customerToken`

**Step 2** — Run any folder or use the **Collection Runner**:

1. Click the **Runner** button in Postman
2. Select the collection
3. Click **Run Urban Farming Platform**

### Test Coverage

| Folder | Requests | What's Tested |
|---|---|---|
| 0. Setup | 6 | Registration & login for all roles |
| 1. Auth | 9 | Register, login, logout, invalid credentials |
| 2. Vendors | 9 | Profile CRUD, admin approval, role guards |
| 3. Produce | 12 | Marketplace CRUD, pagination, filtering |
| 4. Orders | 17 | Place order, status flow, role guards |
| 5. Rentals | 11 | Space CRUD, location search, availability |
| 6. Certifications | 13 | Submit, approve, reject, role guards |
| 7. Forum | 11 | Create, read, delete, owner/admin guards |
| 8. Plant Tracking | 17 | Full CRUD, validation, role guards |
| 9. Admin | 16 | Stats, user management, vendor approval |
| 10. Security | 10 | JWT, rate limiting, response shape, cross-role |
| **Total** | **131** | |

---

## 📊 Benchmark Report

Performance was measured using **autocannon** with 10 concurrent connections over 5 seconds on the three highest-traffic public endpoints.

```bash
autocannon -c 10 -d 5 http://localhost:4000/api/produce
autocannon -c 10 -d 5 http://localhost:4000/api/forum
autocannon -c 10 -d 5 http://localhost:4000/api/rentals
```

### Results Summary

| Endpoint | Avg Latency | Avg Req/Sec | Total (5s) |
|---|---|---|---|
| `GET /api/produce` | 4.27 ms | 2,078 | 10,000 requests |
| `GET /api/forum` | 8.06 ms | 1,184 | 6,000 requests |
| `GET /api/rentals` | 4.20 ms | 2,113 | 11,000 requests |

Full benchmark details are available in `docs/BENCHMARK.md`.

---

## 👥 Roles & Permissions

### Admin
- Created via the database seeder only (cannot register as Admin via API)
- Full platform oversight — manage users, vendors, orders, certifications
- Can delete any community post
- Cannot delete or suspend other Admin accounts

### Vendor (Urban Farmer)
- Registers via the API with `role: "VENDOR"`
- Must create a Vendor Profile before listing produce or rental spaces
- Submits sustainability certifications for Admin approval
- Manages their own produce, rental spaces, and incoming orders

### Customer
- Registers via the API with `role: "CUSTOMER"` (default if role is omitted)
- Browses and orders produce from the marketplace
- Rents farm spaces (browsing is public, booking requires login)
- Tracks their own plants
- Participates in the community forum

---

## 📐 API Response Format

Every endpoint returns a consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "message": "Human readable message",
  "data": { } 
}
```

### Error Response
```json
{
  "success": false,
  "message": "Description of what went wrong",
  "data": null
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Items fetched.",
  "data": {
    "data": [],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Resource created successfully |
| `400` | Bad request / invalid input |
| `401` | Unauthorized / missing or invalid token |
| `403` | Forbidden / insufficient role permissions |
| `404` | Resource not found |
| `409` | Conflict / duplicate resource |
| `429` | Too many requests (rate limited) |
| `500` | Internal server error |

---

## 🛡 Rate Limiting

The following routes are rate-limited to prevent abuse:

| Route | Limit |
|---|---|
| `POST /api/auth/register` | 10 requests per 15 minutes |
| `POST /api/auth/login` | 10 requests per 15 minutes |

When the limit is exceeded, the API returns:

```json
{
  "success": false,
  "message": "Too many requests, please try again later.",
  "data": null
}
```

---

## 🔧 Useful Commands

| Command | Description |
|---|---|
| `npm start` | Start server with nodemon (development) |
| `npm run server` | Start server with node (production) |
| `npm run seed` | Seed the database with test data |
| `npx prisma studio` | Open visual database browser |
| `npx prisma migrate dev --name <name>` | Create and apply a new migration |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npx prisma migrate reset` | Reset database and re-run all migrations |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

Built with ❤️ for the Urban Farming Community

</div>
