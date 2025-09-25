const authService = require('../services/auth.service');

class AuthController {
  async register(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.register(email, password);
      
      res.status(201).json({
        message: 'User registered successfully',
        user: result
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.json({
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
