# Payment Service API Documentation

**Service Port:** 3004  
**Base URL:** `http://localhost:3004`  
**Database:** PostgreSQL (shared database)  
**Table:** `payments`  
**Event Bus:** Kafka (publishes payment events)

## Overview

Payment Service handles payment processing. It validates users and orders through API Gateway, creates payments, and publishes events to Kafka for asynchronous processing.

## Endpoints

### POST /api/payments

Create a new payment. Validates user and order existence, then publishes event to Kafka.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": 1,
  "orderId": 1,
  "amount": 99.99
}
```

**Response (201 Created):**
```json
{
  "message": "Payment created successfully",
  "payment": {
    "paymentId": 1,
    "userId": 1,
    "orderId": 1,
    "amount": 99.99,
    "status": "success",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - userId, orderId, and amount are required
- `400 Bad Request` - Amount must be greater than 0
- `400 Bad Request` - Payment for this order already exists
- `401 Unauthorized` - Access token required
- `404 Not Found` - User not found or Order not found

**Example:**
```bash
curl -X POST http://localhost:3004/api/payments \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "orderId": 1, "amount": 99.99}'
```

**Kafka Event Published:**
After successful payment creation, an event is published to `payment-events` topic:
```json
{
  "eventType": "payment.created",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {
    "paymentId": 1,
    "userId": 1,
    "orderId": 1,
    "amount": 99.99,
    "status": "success"
  }
}
```

---

### GET /api/payments/:id

Get payment by ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "payment": {
    "paymentId": 1,
    "userId": 1,
    "orderId": 1,
    "amount": 99.99,
    "status": "success",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Access token required
- `404 Not Found` - Payment not found

**Example:**
```bash
curl -X GET http://localhost:3004/api/payments/1 \
  -H "Authorization: Bearer <jwt-token>"
```

---

### GET /api/payments/user/:userId

Get all payments for a specific user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "payments": [
    {
      "paymentId": 1,
      "userId": 1,
      "orderId": 1,
      "amount": 99.99,
      "status": "success",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

**Example:**
```bash
curl -X GET http://localhost:3004/api/payments/user/1 \
  -H "Authorization: Bearer <jwt-token>"
```

---

### PUT /api/payments/:id/status

Update payment status. Publishes event to Kafka.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "success"
}
```

**Valid Status Values:**
- `pending`
- `success`
- `failed`
- `cancelled`

**Response (200 OK):**
```json
{
  "payment": {
    "paymentId": 1,
    "userId": 1,
    "orderId": 1,
    "amount": 99.99,
    "status": "success",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T13:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid payment status
- `401 Unauthorized` - Access token required
- `404 Not Found` - Payment not found

**Example:**
```bash
curl -X PUT http://localhost:3004/api/payments/1/status \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "success"}'
```

**Kafka Event Published:**
After status update, an event is published to `payment-events` topic:
```json
{
  "eventType": "payment.status.updated",
  "timestamp": "2024-01-01T13:00:00.000Z",
  "data": {
    "paymentId": 1,
    "userId": 1,
    "orderId": 1,
    "status": "success"
  }
}
```

---

### GET /health

Health check endpoint.

**Response (200 OK):**
```json
{
  "status": "OK",
  "service": "payment-service"
}
```

---

## Database Schema

**Table: payments**
- `payment_id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER NOT NULL) - Links to auth_users.id
- `order_id` (INTEGER NOT NULL) - Links to orders.id
- `amount` (DECIMAL(10,2) NOT NULL)
- `status` (VARCHAR(50) DEFAULT 'pending')
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

**Indexes:**
- `idx_payments_user_id` - On user_id for faster queries
- `idx_payments_order_id` - On order_id for faster queries
- `idx_payments_created_at` - On created_at for sorting

## Kafka Integration

**Topic:** `payment-events`

**Events Published:**

1. **payment.created**
   - Published when a payment is successfully created
   - Consumed by Notification Service to create notifications

2. **payment.status.updated**
   - Published when payment status changes
   - Consumed by Notification Service to notify users

**Producer Configuration:**
- Client ID: `payment-service`
- Broker: `kafka:9092`
- Retry logic: 5 attempts with 3 second delay

## Gateway Integration

Payment Service uses API Gateway to validate:
- **User existence:** `GET /internal/users/:id` via Gateway
- **Order existence:** `GET /internal/orders/:id` via Gateway

This ensures loose coupling between services.

## Environment Variables

- `DB_HOST` - Database host (default: postgres)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: microservices_db)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password
- `GATEWAY_URL` - API Gateway URL (default: http://api-gateway:8080)
- `KAFKA_BROKER` - Kafka broker URL (default: kafka:9092)
- `PAYMENT_SERVICE_PORT` - Service port (default: 3004)

## Architecture

- **Controller:** `src/controllers/payment.controller.js`
- **Service:** `src/services/payment.service.js`
- **Repository:** `src/repositories/payment.repository.js`
- **Model:** `src/models/payment.model.js`
- **Routes:** `src/routes/payment.routes.js`
- **Gateway Service:** `src/services/gateway.service.js`
- **Kafka Service:** `src/services/kafka.service.js`
