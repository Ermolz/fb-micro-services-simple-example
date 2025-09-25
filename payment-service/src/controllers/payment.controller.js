const paymentService = require('../services/payment.service');

class PaymentController {
  async createPayment(req, res) {
    try {
      const paymentData = req.body;
      const payment = await paymentService.createPayment(paymentData);
      
      res.status(201).json({
        message: 'Payment created successfully',
        payment
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('already exists') || error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await paymentService.getPaymentById(id);
      res.json({ payment });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getPaymentsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const payments = await paymentService.getPaymentsByUserId(userId);
      res.json({ payments });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const payment = await paymentService.updatePaymentStatus(id, status);
      res.json({ payment });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PaymentController();
