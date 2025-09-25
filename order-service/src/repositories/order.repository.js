const { pool } = require('../config/db');
const Order = require('../models/order.model');

class OrderRepository {
  async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map(row => Order.fromDbRow(row));
  }

  async findByIdAndUserId(id, userId) {
    const result = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows.length > 0 ? Order.fromDbRow(result.rows[0]) : null;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );
    return result.rows.length > 0 ? Order.fromDbRow(result.rows[0]) : null;
  }

  async create(userId, productName, quantity, price) {
    const result = await pool.query(
      'INSERT INTO orders (user_id, product_name, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, productName, quantity, price]
    );
    return Order.fromDbRow(result.rows[0]);
  }

  async deleteByIdAndUserId(id, userId) {
    const result = await pool.query(
      'DELETE FROM orders WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows.length > 0;
  }
}

module.exports = new OrderRepository();
