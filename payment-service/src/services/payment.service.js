const paymentRepository = require('../repositories/payment.repository');
const gatewayService = require('./gateway.service');

class PaymentService {
  async createPayment(paymentData) {
    const { userId, orderId, amount } = paymentData;

    if (!userId || !orderId || !amount) {
      throw new Error('userId, orderId, and amount are required');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!Number.isInteger(userId) || !Number.isInteger(orderId)) {
      throw new Error('userId and orderId must be integers');
    }

    try {
      await gatewayService.validateUser(userId);
    } catch (error) {
      throw new Error(`User validation failed: ${error.message}`);
    }

    try {
      await gatewayService.validateOrder(orderId);
    } catch (error) {
      throw new Error(`Order validation failed: ${error.message}`);
    }

    const existingPayment = await paymentRepository.findByOrderId(orderId);
    if (existingPayment) {
      throw new Error('Payment for this order already exists');
    }

    const payment = await paymentRepository.create(userId, orderId, amount);
    return payment.toObject();
  }

  async getPaymentById(paymentId) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment.toObject();
  }

  async getPaymentsByUserId(userId) {
    const payments = await paymentRepository.findByUserId(userId);
    return payments.map(payment => payment.toObject());
  }

  async updatePaymentStatus(paymentId, status) {
    const validStatuses = ['pending', 'success', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid payment status');
    }

    const payment = await paymentRepository.updateStatus(paymentId, status);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment.toObject();
  }
}

module.exports = new PaymentService();
