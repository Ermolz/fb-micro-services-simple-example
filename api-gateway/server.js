const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 8080;

app.use(cors());
app.use(express.json());

const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
  user: process.env.USER_SERVICE_URL || 'http://user-service:3002',
  order: process.env.ORDER_SERVICE_URL || 'http://order-service:3003',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004'
};

const proxyRequest = async (serviceUrl, path, method = 'GET', data = null, headers = {}) => {
  try {
    const config = {
      method,
      url: `${serviceUrl}${path}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 5000
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

app.get('/users/:id', async (req, res) => {
  try {
    const headers = {};
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    const data = await proxyRequest(services.user, `/api/users/${req.params.id}`, 'GET', null, headers);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    console.log("Fetching order with ID:", req.params.id);
    const headers = {};
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    const data = await proxyRequest(services.order, `/api/orders/${req.params.id}`, 'GET', null, headers);
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Internal endpoints for Payment Service (no auth required)
app.get('/internal/users/:id', async (req, res) => {
  try {
    const data = await proxyRequest(services.user, `/api/users/internal/${req.params.id}`, 'GET', null, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/internal/orders/:id', async (req, res) => {
  try {
    const data = await proxyRequest(services.order, `/api/orders/internal/${req.params.id}`, 'GET', null, {});
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'api-gateway' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
