const express = require('express');
const router = express.Router();
const { proxyRequest, getAuthHeaders } = require('../utils/proxy');

const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';

router.get('/', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(orderServiceUrl, '/api/orders', 'GET', null, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(orderServiceUrl, `/api/orders/${req.params.id}`, 'GET', null, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(orderServiceUrl, '/api/orders', 'POST', req.body, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(orderServiceUrl, `/api/orders/${req.params.id}`, 'DELETE', null, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = router;
