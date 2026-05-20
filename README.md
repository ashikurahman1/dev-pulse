# 🚼 DevPulse – Internal Tech Issue & Feature Tracker

DevPulse is a collaborative platform designed for software teams to report bugs, suggest features, and coordinate resolutions. It features a secure authentication system, role-based access control, and a fully relational PostgreSQL database backend constructed using raw SQL queries.

## 🚀 Live Demo
* **API Base URL**: `http://localhost:5000` (or your deployed URL)

---

## 🛠️ Technology Stack
* **Runtime**: Node.js LTS (v24.x or higher)
* **Language**: TypeScript
* **Framework**: Express.js (Modular router architecture)
* **Database**: PostgreSQL (Native `pg` driver, raw SQL queries without ORMs/Query Builders)
* **Security**: `bcrypt` (Password hashing) & `jsonwebtoken` (JWT authentication)
* **Status Codes**: `http-status-codes`

---

## 👥 User Roles & Permissions

| Role | Permissions |
| :--- | :--- |
| **contributor** | • Register & login<br>• Create new issues (bug or feature request)<br>• View all issues/details<br>• Update own issues (only if status is still "open") |
| **maintainer** | • All contributor permissions<br>• Update any issue field / status<br>• Delete any issue<br>• Access system metrics |

---

## 🗄️ Database Schema Summary

### `users` Table
* **id**: `SERIAL PRIMARY KEY`
* **name**: `VARCHAR(255)`
* **email**: `VARCHAR(255) UNIQUE NOT NULL`
* **password**: `TEXT NOT NULL`
* **role**: `VARCHAR(255) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer'))`
* **created_at / updated_at**: `TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

### `issues` Table
* **id**: `SERIAL PRIMARY KEY`
* **title**: `VARCHAR(255) NOT NULL`
* **description**: `TEXT NOT NULL`
* **type**: `VARCHAR(255) NOT NULL CHECK (type IN ('bug', 'feature_request'))`
* **status**: `VARCHAR(255) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved'))`
* **reporter_id**: `INT NOT NULL` (references `users.id` validated at application logic)
* **created_at / updated_at**: `TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

---

## 🏁 Setup Instructions

### 1. Prerequisites
Ensure you have **Node.js** and **PostgreSQL** installed.

### 2. Installation
Clone the repository, navigate to the project directory, and install dependencies:
```bash
npm install
```

### 3. Environment Variables (`.env`)
Create a `.env` file in the root directory and add the following keys:
```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d
```

### 4. Run the Application
* **Development mode** (with auto-reload):
  ```bash
  npm run dev
  ```
* **Build TypeScript**:
  ```bash
  npm run build
  ```

---

## 🌐 API Endpoints Specification

### 🔹 Authentication Module

#### 1. User Registration
* **Endpoint**: `POST /api/auth/signup`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@devpulse.com",
    "password": "securePassword123",
    "role": "contributor"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@devpulse.com",
      "role": "contributor",
      "created_at": "2026-05-20T22:00:00Z",
      "updated_at": "2026-05-20T22:00:00Z"
    }
  }
  ```

#### 2. User Login
* **Endpoint**: `POST /api/auth/login`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "john.doe@devpulse.com",
    "password": "securePassword123"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User logged in successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@devpulse.com",
        "role": "contributor",
        "created_at": "2026-05-20T22:00:00Z",
        "updated_at": "2026-05-20T22:00:00Z"
      }
    }
  }
  ```

---

### 🔹 Issues Module

#### 3. Create Issue
* **Endpoint**: `POST /api/issues`
* **Access**: Authenticated users (`contributor`, `maintainer`)
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Request Body**:
  ```json
  {
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug"
  }
  ```

#### 4. Get All Issues
* **Endpoint**: `GET /api/issues`
* **Access**: Public
* **Query Parameters**:
  * `sort`: `newest` (default) or `oldest`
  * `type`: `bug` or `feature_request`
  * `status`: `open`, `in_progress`, or `resolved`

#### 5. Get Single Issue
* **Endpoint**: `GET /api/issues/:id`
* **Access**: Public

#### 6. Update Issue
* **Endpoint**: `PATCH /api/issues/:id`
* **Access**: `maintainer` (any issue) OR `contributor` (own issues only, and only if current status is `"open"`)
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Request Body** (All fields optional):
  ```json
  {
    "title": "Updated title",
    "description": "Updated description with new details",
    "type": "bug",
    "status": "in_progress"
  }
  ```

#### 7. Delete Issue
* **Endpoint**: `DELETE /api/issues/:id`
* **Access**: `maintainer` only
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
