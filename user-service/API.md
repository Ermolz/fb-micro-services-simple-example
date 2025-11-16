# User Service API Documentation

**Service Port:** 3002  
**Base URL:** `http://localhost:3002`  
**Database:** PostgreSQL (shared database)  
**Table:** `users`  
**Cache:** Redis (in-memory caching)

## Overview

User Service manages user profiles with Redis caching for improved performance. All endpoints require JWT authentication except internal endpoints.

## Endpoints

### GET /api/users

Get all users.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": 1,
      "userId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Access token required
- `403 Forbidden` - Invalid or expired token

**Example:**
```bash
curl -X GET http://localhost:3002/api/users \
  -H "Authorization: Bearer <jwt-token>"
```

---

### GET /api/users/:id

Get user by ID. Uses Redis cache for faster response.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Access token required
- `403 Forbidden` - Invalid or expired token
- `404 Not Found` - User not found

**Example:**
```bash
curl -X GET http://localhost:3002/api/users/1 \
  -H "Authorization: Bearer <jwt-token>"
```

**Cache Behavior:**
- First request: Data from PostgreSQL database
- Subsequent requests: Data from Redis cache (faster)
- Cache TTL: 1 hour (3600 seconds)
- Cache invalidation: On update/delete operations

---

### POST /api/users

Create user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main Street"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main Street",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Name and email are required
- `400 Bad Request` - User profile already exists
- `401 Unauthorized` - Access token required

**Example:**
```bash
curl -X POST http://localhost:3002/api/users \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "phone": "+1234567890"}'
```

---

### PUT /api/users/:id

Update user profile. Updates Redis cache automatically.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "+9876543210",
  "address": "456 Oak Avenue"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "userId": 1,
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "phone": "+9876543210",
    "address": "456 Oak Avenue",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T13:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Access token required
- `404 Not Found` - User not found

**Example:**
```bash
curl -X PUT http://localhost:3002/api/users/1 \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith", "email": "johnsmith@example.com"}'
```

---

### DELETE /api/users/:id

Delete user profile. Invalidates Redis cache.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Access token required
- `404 Not Found` - User not found

**Example:**
```bash
curl -X DELETE http://localhost:3002/api/users/1 \
  -H "Authorization: Bearer <jwt-token>"
```

---

### GET /api/users/internal/:id

Internal endpoint for Payment Service (no authentication required).

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Note:** This endpoint is used internally by Payment Service through API Gateway.

---

### GET /health

Health check endpoint.

**Response (200 OK):**
```json
{
  "status": "OK",
  "service": "user-service"
}
```

---

## Database Schema

**Table: users**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER UNIQUE NOT NULL) - Links to auth_users.id
- `name` (VARCHAR(255) NOT NULL)
- `email` (VARCHAR(255) NOT NULL)
- `phone` (VARCHAR(20))
- `address` (TEXT)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

## Redis Caching

**Cache Strategy:** Cache-aside pattern

**Cache Keys:**
- `user:{userId}` - User data cache

**Cache TTL:** 3600 seconds (1 hour)

**Cache Operations:**
- **Get:** Check cache first, if miss → query database → store in cache
- **Update:** Update database → update cache
- **Delete:** Delete from database → invalidate cache

**Benefits:**
- Faster response times for frequently accessed users
- Reduced database load
- Automatic cache invalidation on updates/deletes

## Environment Variables

- `DB_HOST` - Database host (default: postgres)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: microservices_db)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT verification
- `REDIS_URL` - Redis connection URL (default: redis://redis:6379)
- `USER_SERVICE_PORT` - Service port (default: 3002)

## Architecture

- **Controller:** `src/controllers/user.controller.js`
- **Service:** `src/services/user.service.js`
- **Repository:** `src/repositories/user.repository.js`
- **Model:** `src/models/user.model.js`
- **Routes:** `src/routes/user.routes.js`
- **Middleware:** `src/middleware/auth.middleware.js`
- **Cache Service:** `src/services/cache.service.js`
