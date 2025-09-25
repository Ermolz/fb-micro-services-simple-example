const orderRepository = require('../repositories/order.repository');

class OrderService {
  async getUserOrders(userId) {
    const orders = await orderRepository.findByUserId(userId);
    return orders.map(order => order.toObject());
  }

  async getOrderById(id, userId) {
    const order = await orderRepository.findByIdAndUserId(id, userId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order.toObject();
  }

  async getOrderByIdInternal(id) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order.toObject();
  }

  async createOrder(userId, orderData) {
    const { product_name, quantity, price } = orderData;

    if (!product_name || !quantity || !price) {
      throw new Error('Product name, quantity, and price are required');
    }

    if (quantity <= 0 || price <= 0) {
      throw new Error('Quantity and price must be positive numbers');
    }

    const order = await orderRepository.create(userId, product_name, quantity, price);
    return order.toObject();
  }

  async deleteOrder(id, userId) {
    const deleted = await orderRepository.deleteByIdAndUserId(id, userId);
    if (!deleted) {
      throw new Error('Order not found');
    }
    return { message: 'Order deleted successfully' };
  }
}

module.exports = new OrderService();
