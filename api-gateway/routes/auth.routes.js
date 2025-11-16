const express = require('express');
const router = express.Router();
const { proxyRequest } = require('../utils/proxy');

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';

router.post('/register', async (req, res) => {
  try {
    const data = await proxyRequest(authServiceUrl, '/api/register', 'POST', req.body, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = await proxyRequest(authServiceUrl, '/api/login', 'POST', req.body, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = router;
