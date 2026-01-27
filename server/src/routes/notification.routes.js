const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const notificationController = require('../controllers/notification.controller');

router.get('/', authenticate, notificationController.getNotifications);
router.post('/', authenticate, notificationController.createNotification);
router.put('/:id/read', authenticate, notificationController.markAsRead);
router.put('/read-all', authenticate, notificationController.markAllAsRead);

module.exports = router;
