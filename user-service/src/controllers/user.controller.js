const userService = require('../services/user.service');

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.json({ user });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createUserProfile(req, res) {
    try {
      const userData = req.body;
      const user = await userService.createUserProfile(req.user.userId, userData);
      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await userService.updateUserProfile(id, userData);
      res.json({ user });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteUserProfile(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUserProfile(id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
