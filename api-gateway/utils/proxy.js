const axios = require('axios');

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

const getAuthHeaders = (req) => {
  const headers = {};
  if (req.headers.authorization) {
    headers.Authorization = req.headers.authorization;
  }
  return headers;
};

module.exports = {
  proxyRequest,
  getAuthHeaders
};
