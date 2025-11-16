require('dotenv').config();

module.exports = {
  port: process.env.PAYMENT_SERVICE_PORT,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  gateway: {
    url: process.env.GATEWAY_URL,
  },
  kafka: {
    broker: process.env.KAFKA_BROKER || 'kafka:9092',
  },
};
