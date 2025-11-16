const express = require('express');
const router = express.Router();
const { proxyRequest, getAuthHeaders } = require('../utils/proxy');

const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3002';

router.get('/', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(userServiceUrl, '/api/users', 'GET', null, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(userServiceUrl, `/api/users/${req.params.id}`, 'GET', null, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(userServiceUrl, '/api/users', 'POST', req.body, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(userServiceUrl, `/api/users/${req.params.id}`, 'PUT', req.body, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const headers = getAuthHeaders(req);
    const data = await proxyRequest(userServiceUrl, `/api/users/${req.params.id}`, 'DELETE', null, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = router;
