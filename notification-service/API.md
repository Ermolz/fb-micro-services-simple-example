# Notification Service API Documentation

**Service Port:** 3005  
**Base URL:** `http://localhost:3005`  
**Database:** MongoDB (dedicated database)  
**Collection:** `notifications`  
**Event Bus:** Kafka (consumes payment events)

## Overview

Notification Service manages user notifications. It consumes Kafka events from Payment Service and automatically creates notifications. Uses MongoDB as a dedicated database (Database per Service pattern).

## Endpoints

### GET /api/notifications/user/:userId

Get all notifications for a specific user.

**Response (200 OK):**
```json
{
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": 1,
      "type": "payment",
      "title": "Payment Created",
      "message": "Payment of $99.99 has been created for order #1",
      "read": false,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

**Example:**
```bash
curl -X GET http://localhost:3005/api/notifications/user/1
```

---

### GET /api/notifications/:id

Get notification by ID.

**Response (200 OK):**
```json
{
  "notification": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": 1,
    "type": "payment",
    "title": "Payment Created",
    "message": "Payment of $99.99 has been created for order #1",
    "read": false,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Notification not found

**Example:**
```bash
curl -X GET http://localhost:3005/api/notifications/507f1f77bcf86cd799439011
```

---

### POST /api/notifications

Create a notification manually.

**Request Body:**
```json
{
  "userId": 1,
  "type": "info",
  "title": "Welcome!",
  "message": "Welcome to our platform!"
}
```

**Response (201 Created):**
```json
{
  "notification": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": 1,
    "type": "info",
    "title": "Welcome!",
    "message": "Welcome to our platform!",
    "read": false,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - userId, type, title, and message are required

**Example:**
```bash
curl -X POST http://localhost:3005/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "type": "info", "title": "Welcome!", "message": "Welcome to our platform!"}'
```

---

### PUT /api/notifications/:id/read

Mark notification as read.

**Response (200 OK):**
```json
{
  "message": "Notification marked as read",
  "notification": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": 1,
    "type": "payment",
    "title": "Payment Created",
    "message": "Payment of $99.99 has been created for order #1",
    "read": true,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T13:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Notification not found

**Example:**
```bash
curl -X PUT http://localhost:3005/api/notifications/507f1f77bcf86cd799439011/read
```

---

### PUT /api/notifications/user/:userId/read-all

Mark all notifications as read for a user.

**Response (200 OK):**
```json
{
  "message": "All notifications marked as read",
  "updatedCount": 5
}
```

**Example:**
```bash
curl -X PUT http://localhost:3005/api/notifications/user/1/read-all
```

---

### GET /api/notifications/user/:userId/unread-count

Get count of unread notifications for a user.

**Response (200 OK):**
```json
{
  "userId": 1,
  "unreadCount": 3
}
```

**Example:**
```bash
curl -X GET http://localhost:3005/api/notifications/user/1/unread-count
```

---

### DELETE /api/notifications/:id

Delete a notification.

**Response (200 OK):**
```json
{
  "message": "Notification deleted successfully"
}
```

**Error Responses:**
- `404 Not Found` - Notification not found

**Example:**
```bash
curl -X DELETE http://localhost:3005/api/notifications/507f1f77bcf86cd799439011
```

---

### GET /health

Health check endpoint.

**Response (200 OK):**
```json
{
  "status": "OK",
  "service": "notification-service"
}
```

---

## Database Schema

**MongoDB Collection: notifications**

**Document Structure:**
```javascript
{
  _id: ObjectId,
  userId: Number,        // Required
  type: String,          // Required (e.g., "payment", "info", "warning")
  title: String,         // Required
  message: String,       // Required
  read: Boolean,         // Default: false
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

**Indexes:**
- `userId` - For faster queries by user
- `read` - For filtering unread notifications
- `createdAt` - For sorting by date

## Kafka Integration

**Topic:** `payment-events`

**Consumer Configuration:**
- Group ID: `notification-service-group`
- Broker: `kafka:9092`
- Retry logic: 10 attempts with 5 second delay

**Events Consumed:**

1. **payment.created**
   - Automatically creates notification when payment is created
   - Notification type: `payment`
   - Title: "Payment Created"
   - Message: "Payment of $X has been created for order #Y"

2. **payment.status.updated**
   - Automatically creates notification when payment status changes
   - Notification type: `payment`
   - Title: "Payment Status Updated"
   - Message: Status-specific message (success, failed, cancelled)

**Event Processing:**
- Events are consumed asynchronously
- Notifications are created automatically in MongoDB
- No manual intervention required

## Database per Service Pattern

This service uses **MongoDB** as its dedicated database, demonstrating the "Database per Service" pattern:

- **Isolation:** Each service has its own database
- **Technology Choice:** Can use different database technologies per service
- **Scalability:** Services can scale independently
- **Data Ownership:** Each service owns its data

**Other Services:**
- Auth, User, Order, Payment Services → PostgreSQL (shared)
- Notification Service → MongoDB (dedicated)

## Environment Variables

- `MONGODB_URL` - MongoDB connection URL (default: mongodb://mongodb:27017)
- `MONGODB_DB` - MongoDB database name (default: notifications_db)
- `KAFKA_BROKER` - Kafka broker URL (default: kafka:9092)
- `NOTIFICATION_SERVICE_PORT` - Service port (default: 3005)

## Architecture

- **Controller:** `src/controllers/notification.controller.js`
- **Service:** `src/services/notification.service.js`
- **Repository:** `src/repositories/notification.repository.js`
- **Model:** `src/models/notification.model.js`
- **Routes:** `src/routes/notification.routes.js`
- **Kafka Consumer:** `src/services/kafka.consumer.js`
