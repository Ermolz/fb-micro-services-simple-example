const orderService = require('../services/order.service');

class OrderController {
  async getUserOrders(req, res) {
    try {
      const orders = await orderService.getUserOrders(req.user.userId);
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id, req.user.userId);
      res.json({ order });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getOrderByIdInternal(req, res) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderByIdInternal(id);
      res.json({ order });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      const orderData = req.body;
      const order = await orderService.createOrder(req.user.userId, orderData);
      res.status(201).json({ order });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const result = await orderService.deleteOrder(id, req.user.userId);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
