const { pool } = require('../config/db');
const AuthUser = require('../models/authUser.model');

class AuthRepository {
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM auth_users WHERE email = $1',
      [email]
    );
    return result.rows.length > 0 ? AuthUser.fromDbRow(result.rows[0]) : null;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM auth_users WHERE id = $1',
      [id]
    );
    return result.rows.length > 0 ? AuthUser.fromDbRow(result.rows[0]) : null;
  }

  async create(email, hashedPassword) {
    const result = await pool.query(
      'INSERT INTO auth_users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    );
    return AuthUser.fromDbRow(result.rows[0]);
  }

  async emailExists(email) {
    const result = await pool.query(
      'SELECT id FROM auth_users WHERE email = $1',
      [email]
    );
    return result.rows.length > 0;
  }
}

module.exports = new AuthRepository();
