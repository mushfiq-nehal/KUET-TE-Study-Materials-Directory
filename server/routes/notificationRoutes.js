const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', notificationController.getNotifications);
router.post('/', authMiddleware, adminMiddleware, notificationController.createNotification);
router.put('/:id/read', authMiddleware, notificationController.markAsRead);
router.delete('/:id', authMiddleware, adminMiddleware, notificationController.deleteNotification);

module.exports = router;
