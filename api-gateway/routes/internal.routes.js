const express = require('express');
const router = express.Router();
const { proxyRequest } = require('../utils/proxy');

const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3002';
const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';

router.get('/users/:id', async (req, res) => {
  try {
    const data = await proxyRequest(userServiceUrl, `/api/users/internal/${req.params.id}`, 'GET', null, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const data = await proxyRequest(orderServiceUrl, `/api/orders/internal/${req.params.id}`, 'GET', null, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = router;
