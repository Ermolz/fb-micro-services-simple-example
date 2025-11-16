# API Gateway Documentation

**Gateway Port:** 8080  
**Base URL:** `http://localhost:8080`  
**Purpose:** Single entry point for all microservices

## Overview

API Gateway is the central entry point for all client requests. It routes requests to appropriate microservices and handles authentication headers forwarding.

## Project Structure

```
api-gateway/
├── routes/
│   ├── auth.routes.js          # Auth Service routes
│   ├── user.routes.js           # User Service routes
│   ├── order.routes.js          # Order Service routes
│   ├── payment.routes.js        # Payment Service routes
│   ├── notification.routes.js   # Notification Service routes
│   └── internal.routes.js       # Internal service-to-service routes
├── utils/
│   └── proxy.js                # Proxy utility functions
├── server.js                   # Main application entry point
└── API.md                      # This documentation
```

Each service has its own route file for better code organization and maintainability.

## Service Routing

| Service | Internal Port | Gateway Route Prefix |
|---------|--------------|---------------------|
| Auth Service | 3001 | `/api/auth/*` |
| User Service | 3002 | `/api/users/*` |
| Order Service | 3003 | `/api/orders/*` |
| Payment Service | 3004 | `/api/payments/*` |
| Notification Service | 3005 | `/api/notifications/*` |

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

**How to get a token:**
1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login` (returns token)

## API Endpoints

### Auth Service Routes

#### POST /api/auth/register
Register a new user.

**Target Service:** Auth Service (Port 3001)  
**Authentication:** Not required

**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Response:** See [Auth Service API.md](../auth-service/API.md)

---

#### POST /api/auth/login
Login and get JWT token.

**Target Service:** Auth Service (Port 3001)  
**Authentication:** Not required

**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Response:** See [Auth Service API.md](../auth-service/API.md)

---

### User Service Routes

#### GET /api/users
Get all users.

**Target Service:** User Service (Port 3002)  
**Authentication:** Required

**Request:**
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer <jwt-token>"
```

**Response:** See [User Service API.md](../user-service/API.md)

---

#### GET /api/users/:id
Get user by ID.

**Target Service:** User Service (Port 3002)  
**Authentication:** Required

**Request:**
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer <jwt-token>"
```

**Response:** See [User Service API.md](../user-service/API.md)

---

#### POST /api/users
Create user profile.

**Target Service:** User Service (Port 3002)  
**Authentication:** Required

**Request:**
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

**Response:** See [User Service API.md](../user-service/API.md)

---

#### PUT /api/users/:id
Update user profile.

**Target Service:** User Service (Port 3002)  
**Authentication:** Required

**Request:**
```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith"}'
```

**Response:** See [User Service API.md](../user-service/API.md)

---

#### DELETE /api/users/:id
Delete user profile.

**Target Service:** User Service (Port 3002)  
**Authentication:** Required

**Request:**
```bash
curl -X DELETE http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer <jwt-token>"
```

**Response:** See [User Service API.md](../user-service/API.md)

---

### Order Service Routes

#### GET /api/orders
Get all orders for authenticated user.

**Target Service:** Order Service (Port 3003)  
**Authentication:** Required

**Request:**
```bash
curl -X GET http://localhost:8080/api/orders \
  -H "Authorization: Bearer <jwt-token>"
```

**Response:** See [Order Service API.md](../order-service/API.md)

---

#### GET /api/orders/:id
Get order by ID.

**Target Service:** Order Service (Port 3003)  
**Authentication:** Required

**Request:**
```bash
curl -X GET http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer <jwt-token>"
```

**Response:** See [Order Service API.md](../order-service/API.md)

---

#### POST /api/orders
Create a new order.

**Target Service:** Order Service (Port 3003)  
**Authentication:** Required

**Request:**
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"product_name": "Laptop", "quantity": 1, "price": 999.99}'
```

**Response:** See [Order Service API.md](../order-service/API.md)

---

#### DELETE /api/orders/:id
Delete order.

**Target Service:** Order Service (Port 3003)  
**Authentication:** Required

**Request:**
```bash
curl -X DELETE http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer <jwt-token>"
```

**Response:** See [Order Service API.md](../order-service/API.md)

---

### Payment Service Routes

#### POST /api/payments
Create a new payment.

**Target Service:** Payment Service (Port 3004)  
**Authentication:** Required

**Request:**
```bash
curl -X POST http://localhost:8080/api/payments \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "orderId": 1, "amount": 99.99}'
```

**Response:** See [Payment Service API.md](../payment-service/API.md)

---

#### GET /api/payments/:id
Get payment by ID.

**Target Service:** Payment Service (Port 3004)  
**Authentication:** Required

**Request:**
```bash
curl -X GET http://localhost:8080/api/payments/1 \
  -H "Authorization: Bearer <jwt-token>"
```

**Response:** See [Payment Service API.md](../payment-service/API.md)

---

#### GET /api/payments/user/:userId
Get all payments for a user.

**Target Service:** Payment Service (Port 3004)  
**Authentication:** Required

**Request:**
```bash
curl -X GET http://localhost:8080/api/payments/user/1 \
  -H "Authorization: Bearer <jwt-token>"
```

**Response:** See [Payment Service API.md](../payment-service/API.md)

---

#### PUT /api/payments/:id/status
Update payment status.

**Target Service:** Payment Service (Port 3004)  
**Authentication:** Required

**Request:**
```bash
curl -X PUT http://localhost:8080/api/payments/1/status \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "success"}'
```

**Response:** See [Payment Service API.md](../payment-service/API.md)

---

### Notification Service Routes

#### GET /api/notifications/user/:userId
Get all notifications for a user.

**Target Service:** Notification Service (Port 3005)  
**Authentication:** Not required

**Request:**
```bash
curl -X GET http://localhost:8080/api/notifications/user/1
```

**Response:** See [Notification Service API.md](../notification-service/API.md)

---

#### GET /api/notifications/:id
Get notification by ID.

**Target Service:** Notification Service (Port 3005)  
**Authentication:** Not required

**Request:**
```bash
curl -X GET http://localhost:8080/api/notifications/507f1f77bcf86cd799439011
```

**Response:** See [Notification Service API.md](../notification-service/API.md)

---

#### POST /api/notifications
Create a notification manually.

**Target Service:** Notification Service (Port 3005)  
**Authentication:** Not required

**Request:**
```bash
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "type": "info", "title": "Welcome!", "message": "Welcome!"}'
```

**Response:** See [Notification Service API.md](../notification-service/API.md)

---

#### PUT /api/notifications/:id/read
Mark notification as read.

**Target Service:** Notification Service (Port 3005)  
**Authentication:** Not required

**Request:**
```bash
curl -X PUT http://localhost:8080/api/notifications/507f1f77bcf86cd799439011/read
```

**Response:** See [Notification Service API.md](../notification-service/API.md)

---

#### PUT /api/notifications/user/:userId/read-all
Mark all notifications as read for a user.

**Target Service:** Notification Service (Port 3005)  
**Authentication:** Not required

**Request:**
```bash
curl -X PUT http://localhost:8080/api/notifications/user/1/read-all
```

**Response:** See [Notification Service API.md](../notification-service/API.md)

---

#### GET /api/notifications/user/:userId/unread-count
Get unread notification count.

**Target Service:** Notification Service (Port 3005)  
**Authentication:** Not required

**Request:**
```bash
curl -X GET http://localhost:8080/api/notifications/user/1/unread-count
```

**Response:** See [Notification Service API.md](../notification-service/API.md)

---

#### DELETE /api/notifications/:id
Delete a notification.

**Target Service:** Notification Service (Port 3005)  
**Authentication:** Not required

**Request:**
```bash
curl -X DELETE http://localhost:8080/api/notifications/507f1f77bcf86cd799439011
```

**Response:** See [Notification Service API.md](../notification-service/API.md)

---

### Internal Endpoints (Service-to-Service)

These endpoints are used internally by services and do not require authentication.

#### GET /internal/users/:id
Get user by ID (internal use).

**Target Service:** User Service (Port 3002)  
**Authentication:** Not required  
**Used by:** Payment Service

**Request:**
```bash
curl -X GET http://localhost:8080/internal/users/1
```

---

#### GET /internal/orders/:id
Get order by ID (internal use).

**Target Service:** Order Service (Port 3003)  
**Authentication:** Not required  
**Used by:** Payment Service

**Request:**
```bash
curl -X GET http://localhost:8080/internal/orders/1
```

---

### Health Check

#### GET /health
Check API Gateway health.

**Response:**
```json
{
  "status": "OK",
  "service": "api-gateway"
}
```

**Request:**
```bash
curl -X GET http://localhost:8080/health
```

---

## Request Flow

```
Client Request
    ↓
API Gateway (Port 8080)
    ↓
[Route to appropriate service]
    ↓
Auth Service (3001) | User Service (3002) | Order Service (3003) | Payment Service (3004) | Notification Service (3005)
    ↓
Response back through Gateway
    ↓
Client
```

## Error Handling

The Gateway forwards error responses from services with appropriate HTTP status codes:

- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Token expired or insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Service error

## Environment Variables

- `GATEWAY_PORT` - Gateway port (default: 8080)
- `AUTH_SERVICE_URL` - Auth Service URL (default: http://auth-service:3001)
- `USER_SERVICE_URL` - User Service URL (default: http://user-service:3002)
- `ORDER_SERVICE_URL` - Order Service URL (default: http://order-service:3003)
- `PAYMENT_SERVICE_URL` - Payment Service URL (default: http://payment-service:3004)
- `NOTIFICATION_SERVICE_URL` - Notification Service URL (default: http://notification-service:3005)

## Architecture

- **Entry Point:** `server.js`
- **Routing:** Express.js routes
- **Proxy:** Axios for HTTP requests to services
- **CORS:** Enabled for cross-origin requests
- **Authentication:** Forwards Authorization headers to services

## Complete API Reference

For detailed API documentation, see individual service documentation:

- [Auth Service API](../auth-service/API.md)
- [User Service API](../user-service/API.md)
- [Order Service API](../order-service/API.md)
- [Payment Service API](../payment-service/API.md)
- [Notification Service API](../notification-service/API.md)
