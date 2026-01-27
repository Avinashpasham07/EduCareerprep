const Notification = require('../models/Notification');
const User = require('../models/User');

// Get notifications for a user based on their identity and role
exports.getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        const query = {
            $or: [
                { recipient: userId }, // Direct message
                { isGlobal: true } // Global announcement
            ]
        };

        // If student, include notifications for their college
        if (user.role === 'student' && user.profile?.collegeId) {
            query.$or.push({ targetCollege: user.profile.collegeId });
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50)
            .lean(); // Use lean for performance and easier manipulation

        // Add virtual 'read' flag based on current user
        const processedNotifications = notifications.map(notif => ({
            ...notif,
            read: notif.readBy?.some(id => id.toString() === userId) || false
        }));

        res.json(processedNotifications);
    } catch (err) { next(err); }
};

// Create a new notification
exports.createNotification = async (req, res, next) => {
    try {
        const { recipient, targetCollege, type, title, message, link, priority, isGlobal } = req.body;
        const senderId = req.user.id;

        // Check permissions based on role
        const sender = await User.findById(senderId);

        let finalTargetCollege = targetCollege;
        if (targetCollege === 'my-college' && sender.role === 'counselor') {
            finalTargetCollege = senderId;
        }

        const notification = new Notification({
            recipient,
            targetCollege: finalTargetCollege,
            sender: senderId,
            type,
            title,
            message,
            link,
            priority,
            isGlobal
        });

        await notification.save();
        res.json(notification);
    } catch (err) { next(err); }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (!notification.readBy.includes(userId)) {
            notification.readBy.push(userId);
            await notification.save();
        }

        res.json({ success: true });
    } catch (err) { next(err); }
};

// Mark all as read
exports.markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        const query = {
            $or: [
                { recipient: userId },
                { isGlobal: true }
            ],
            readBy: { $ne: userId }
        };

        if (user.role === 'student' && user.profile?.collegeId) {
            query.$or.push({ targetCollege: user.profile.collegeId });
        }

        await Notification.updateMany(query, { $addToSet: { readBy: userId } });
        res.json({ success: true });
    } catch (err) { next(err); }
};
