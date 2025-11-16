# Order Service API Documentation

**Service Port:** 3003  
**Base URL:** `http://localhost:3003`  
**Database:** PostgreSQL (shared database)  
**Table:** `orders`

## Overview

Order Service manages user orders. All endpoints require JWT authentication except internal endpoints.

## Endpoints

### GET /api/orders

Get all orders for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "orders": [
    {
      "id": 1,
      "userId": 1,
      "productName": "Laptop",
      "quantity": 1,
      "price": 999.99,
      "status": "pending",
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
curl -X GET http://localhost:3003/api/orders \
  -H "Authorization: Bearer <jwt-token>"
```

---

### GET /api/orders/:id

Get order by ID (only if order belongs to authenticated user).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "order": {
    "id": 1,
    "userId": 1,
    "productName": "Laptop",
    "quantity": 1,
    "price": 999.99,
    "status": "pending",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Access token required
- `403 Forbidden` - Invalid or expired token
- `404 Not Found` - Order not found

**Example:**
```bash
curl -X GET http://localhost:3003/api/orders/1 \
  -H "Authorization: Bearer <jwt-token>"
```

---

### POST /api/orders

Create a new order.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_name": "MacBook Pro",
  "quantity": 1,
  "price": 1999.99
}
```

**Response (201 Created):**
```json
{
  "order": {
    "id": 1,
    "userId": 1,
    "productName": "MacBook Pro",
    "quantity": 1,
    "price": 1999.99,
    "status": "pending",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Product name, quantity, and price are required
- `400 Bad Request` - Quantity and price must be positive numbers
- `401 Unauthorized` - Access token required

**Example:**
```bash
curl -X POST http://localhost:3003/api/orders \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"product_name": "MacBook Pro", "quantity": 1, "price": 1999.99}'
```

---

### DELETE /api/orders/:id

Delete order (only if order belongs to authenticated user).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Order deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Access token required
- `404 Not Found` - Order not found

**Example:**
```bash
curl -X DELETE http://localhost:3003/api/orders/1 \
  -H "Authorization: Bearer <jwt-token>"
```

---

### GET /api/orders/internal/:id

Internal endpoint for Payment Service (no authentication required).

**Response (200 OK):**
```json
{
  "order": {
    "id": 1,
    "userId": 1,
    "productName": "Laptop",
    "quantity": 1,
    "price": 999.99,
    "status": "pending"
  }
}
```

**Note:** This endpoint is used internally by Payment Service through API Gateway to validate orders.

---

### GET /health

Health check endpoint.

**Response (200 OK):**
```json
{
  "status": "OK",
  "service": "order-service"
}
```

---

## Database Schema

**Table: orders**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER NOT NULL) - Links to auth_users.id
- `product_name` (VARCHAR(255) NOT NULL)
- `quantity` (INTEGER NOT NULL)
- `price` (DECIMAL(10,2) NOT NULL)
- `status` (VARCHAR(50) DEFAULT 'pending')
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

**Indexes:**
- `idx_orders_user_id` - On user_id for faster queries
- `idx_orders_created_at` - On created_at for sorting

## Environment Variables

- `DB_HOST` - Database host (default: postgres)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: microservices_db)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT verification
- `ORDER_SERVICE_PORT` - Service port (default: 3003)

## Architecture

- **Controller:** `src/controllers/order.controller.js`
- **Service:** `src/services/order.service.js`
- **Repository:** `src/repositories/order.repository.js`
- **Model:** `src/models/order.model.js`
- **Routes:** `src/routes/order.routes.js`
- **Middleware:** `src/middleware/auth.middleware.js`
