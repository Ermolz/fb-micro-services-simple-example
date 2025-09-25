const { pool } = require('../config/db');
const Payment = require('../models/payment.model');

class PaymentRepository {
  async create(userId, orderId, amount) {
    const result = await pool.query(
      'INSERT INTO payments (user_id, order_id, amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, orderId, amount, 'success']
    );
    return Payment.fromDbRow(result.rows[0]);
  }

  async findById(paymentId) {
    const result = await pool.query(
      'SELECT * FROM payments WHERE payment_id = $1',
      [paymentId]
    );
    return result.rows.length > 0 ? Payment.fromDbRow(result.rows[0]) : null;
  }

  async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map(row => Payment.fromDbRow(row));
  }

  async findByOrderId(orderId) {
    const result = await pool.query(
      'SELECT * FROM payments WHERE order_id = $1',
      [orderId]
    );
    return result.rows.length > 0 ? Payment.fromDbRow(result.rows[0]) : null;
  }

  async updateStatus(paymentId, status) {
    const result = await pool.query(
      'UPDATE payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE payment_id = $2 RETURNING *',
      [status, paymentId]
    );
    return result.rows.length > 0 ? Payment.fromDbRow(result.rows[0]) : null;
  }
}

module.exports = new PaymentRepository();
