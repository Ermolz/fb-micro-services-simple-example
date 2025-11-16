const express = require('express');
const cors = require('cors');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'notification-service' });
});

module.exports = app;
