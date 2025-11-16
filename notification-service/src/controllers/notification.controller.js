const notificationService = require('../services/notification.service');

class NotificationController {
  async createNotification(req, res) {
    try {
      const notificationData = req.body;
      const notification = await notificationService.createNotification(notificationData);
      res.status(201).json({ notification });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getNotificationById(req, res) {
    try {
      const { id } = req.params;
      const notification = await notificationService.getNotificationById(id);
      res.json({ notification });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getNotificationsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const notifications = await notificationService.getNotificationsByUserId(userId);
      res.json({ notifications });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const result = await notificationService.markAsRead(id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const { userId } = req.params;
      const result = await notificationService.markAllAsRead(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const result = await notificationService.deleteNotification(id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const { userId } = req.params;
      const result = await notificationService.getUnreadCount(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new NotificationController();
