# Auth Service API Documentation

**Service Port:** 3001  
**Base URL:** `http://localhost:3001`  
**Database:** PostgreSQL (shared database)  
**Table:** `auth_users`

## Overview

Auth Service handles user registration and authentication. It provides JWT tokens for accessing other services.

## Endpoints

### POST /api/register

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Email and password are required
- `400 Bad Request` - User already exists

**Example:**
```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

---

### POST /api/login

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Email and password are required
- `401 Unauthorized` - Invalid credentials

**Example:**
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Note:** Save the `token` from response to use in Authorization header for other services.

---

### GET /health

Health check endpoint.

**Response (200 OK):**
```json
{
  "status": "OK",
  "service": "auth-service"
}
```

---

## Database Schema

**Table: auth_users**
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `password` (VARCHAR(255) NOT NULL) - Hashed with bcrypt
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

## Environment Variables

- `DB_HOST` - Database host (default: postgres)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: microservices_db)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time (default: 24h)
- `AUTH_SERVICE_PORT` - Service port (default: 3001)

## Architecture

- **Controller:** `src/controllers/auth.controller.js`
- **Service:** `src/services/auth.service.js`
- **Repository:** `src/repositories/auth.repository.js`
- **Model:** `src/models/authUser.model.js`
- **Routes:** `src/routes/auth.routes.js`
