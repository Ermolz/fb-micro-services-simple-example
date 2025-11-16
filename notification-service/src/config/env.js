require('dotenv').config();

module.exports = {
  port: process.env.NOTIFICATION_SERVICE_PORT,
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://mongodb:27017',
    db: process.env.MONGODB_DB || 'notifications_db',
  },
  kafka: {
    broker: process.env.KAFKA_BROKER || 'kafka:9092',
  },
};
