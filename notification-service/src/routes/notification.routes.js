const express = require('express');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

router.post('/', notificationController.createNotification.bind(notificationController));
router.get('/:id', notificationController.getNotificationById.bind(notificationController));
router.get('/user/:userId', notificationController.getNotificationsByUserId.bind(notificationController));
router.put('/:id/read', notificationController.markAsRead.bind(notificationController));
router.put('/user/:userId/read-all', notificationController.markAllAsRead.bind(notificationController));
router.delete('/:id', notificationController.deleteNotification.bind(notificationController));
router.get('/user/:userId/unread-count', notificationController.getUnreadCount.bind(notificationController));

module.exports = router;
