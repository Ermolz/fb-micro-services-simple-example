const notificationRepository = require('../repositories/notification.repository');

class NotificationService {
  async createNotification(notificationData) {
    const { userId, type, title, message } = notificationData;

    if (!userId || !type || !title || !message) {
      throw new Error('userId, type, title, and message are required');
    }

    const notification = await notificationRepository.create(notificationData);
    return notification.toObject();
  }

  async getNotificationById(id) {
    const notification = await notificationRepository.findById(id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification.toObject();
  }

  async getNotificationsByUserId(userId) {
    const notifications = await notificationRepository.findByUserId(userId);
    return notifications.map(notification => notification.toObject());
  }

  async markAsRead(id) {
    const updated = await notificationRepository.markAsRead(id);
    if (!updated) {
      throw new Error('Notification not found');
    }
    return { message: 'Notification marked as read' };
  }

  async markAllAsRead(userId) {
    const count = await notificationRepository.markAllAsRead(userId);
    return { message: `${count} notifications marked as read` };
  }

  async deleteNotification(id) {
    const deleted = await notificationRepository.delete(id);
    if (!deleted) {
      throw new Error('Notification not found');
    }
    return { message: 'Notification deleted successfully' };
  }

  async getUnreadCount(userId) {
    const count = await notificationRepository.getUnreadCount(userId);
    return { unreadCount: count };
  }
}

module.exports = new NotificationService();
