const express = require('express');
const router = express.Router();
const { proxyRequest } = require('../utils/proxy');

const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3005';

router.get('/user/:userId', async (req, res) => {
  try {
    const data = await proxyRequest(notificationServiceUrl, `/api/notifications/user/${req.params.userId}`, 'GET', null, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await proxyRequest(notificationServiceUrl, `/api/notifications/${req.params.id}`, 'GET', null, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await proxyRequest(notificationServiceUrl, '/api/notifications', 'POST', req.body, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const data = await proxyRequest(notificationServiceUrl, `/api/notifications/${req.params.id}/read`, 'PUT', null, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.put('/user/:userId/read-all', async (req, res) => {
  try {
    const data = await proxyRequest(notificationServiceUrl, `/api/notifications/user/${req.params.userId}/read-all`, 'PUT', null, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.get('/user/:userId/unread-count', async (req, res) => {
  try {
    const data = await proxyRequest(notificationServiceUrl, `/api/notifications/user/${req.params.userId}/unread-count`, 'GET', null, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await proxyRequest(notificationServiceUrl, `/api/notifications/${req.params.id}`, 'DELETE', null, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = router;
