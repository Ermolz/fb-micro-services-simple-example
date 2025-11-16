const express = require('express');
const router = express.Router();
const { proxyRequest, getAuthHeaders } = require('../utils/proxy');

const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004';

router.post('/', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(paymentServiceUrl, '/api/payments', 'POST', req.body, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(paymentServiceUrl, `/api/payments/${req.params.id}`, 'GET', null, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(paymentServiceUrl, `/api/payments/user/${req.params.userId}`, 'GET', null, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(paymentServiceUrl, `/api/payments/${req.params.id}/status`, 'PUT', req.body, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = router;
