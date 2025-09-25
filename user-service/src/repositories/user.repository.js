const { pool } = require('../config/db');
const User = require('../models/user.model');

class UserRepository {
  async findAll() {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows.map(row => User.fromDbRow(row));
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length > 0 ? User.fromDbRow(result.rows[0]) : null;
  }

  async findByUserId(userId) {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    return result.rows.length > 0 ? User.fromDbRow(result.rows[0]) : null;
  }

  async create(userId, name, email, phone, address) {
    const result = await pool.query(
      'INSERT INTO users (user_id, name, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, name, email, phone, address]
    );
    return User.fromDbRow(result.rows[0]);
  }

  async update(id, name, email, phone, address) {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3, address = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, email, phone, address, id]
    );
    return result.rows.length > 0 ? User.fromDbRow(result.rows[0]) : null;
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows.length > 0;
  }

  async userProfileExists(userId) {
    const result = await pool.query('SELECT id FROM users WHERE user_id = $1', [userId]);
    return result.rows.length > 0;
  }
}

module.exports = new UserRepository();
