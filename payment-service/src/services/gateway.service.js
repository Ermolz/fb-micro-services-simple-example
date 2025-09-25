const axios = require('axios');
const config = require('../config/env');

class GatewayService {
  async validateUser(userId) {
    try {
      const response = await axios.get(
        `${config.gateway.url}/internal/users/${userId}`,
        { timeout: 5000 }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(`User validation failed: ${error.message}`);
    }
  }

  async validateOrder(orderId) {
    try {
      const response = await axios.get(
        `${config.gateway.url}/internal/orders/${orderId}`,
        { timeout: 5000 }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Order not found');
      }
      throw new Error(`Order validation failed: ${error.message}`);
    }
  }
}

module.exports = new GatewayService();
