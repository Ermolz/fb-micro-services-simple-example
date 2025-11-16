const { getDB } = require('../config/db');
const Notification = require('../models/notification.model');
const { ObjectId } = require('mongodb');

class NotificationRepository {
  async create(notificationData) {
    const db = getDB();
    const notification = new Notification(
      null,
      notificationData.userId,
      notificationData.type,
      notificationData.title,
      notificationData.message,
      false,
      new Date()
    );
    
    const result = await db.collection('notifications').insertOne(notification.toMongoDoc());
    return Notification.fromMongoDoc({ ...notification.toMongoDoc(), _id: result.insertedId });
  }

  async findById(id) {
    const db = getDB();
    const doc = await db.collection('notifications').findOne({ _id: new ObjectId(id) });
    return doc ? Notification.fromMongoDoc(doc) : null;
  }

  async findByUserId(userId) {
    const db = getDB();
    const docs = await db.collection('notifications')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(doc => Notification.fromMongoDoc(doc));
  }

  async markAsRead(id) {
    const db = getDB();
    const result = await db.collection('notifications').updateOne(
      { _id: new ObjectId(id) },
      { $set: { read: true } }
    );
    return result.modifiedCount > 0;
  }

  async markAllAsRead(userId) {
    const db = getDB();
    const result = await db.collection('notifications').updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );
    return result.modifiedCount;
  }

  async delete(id) {
    const db = getDB();
    const result = await db.collection('notifications').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async getUnreadCount(userId) {
    const db = getDB();
    return await db.collection('notifications').countDocuments({ userId, read: false });
  }
}

module.exports = new NotificationRepository();
