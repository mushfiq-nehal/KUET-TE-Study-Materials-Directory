const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('createdBy', 'name roll')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const notification = new Notification({
      title,
      message,
      type,
      createdBy: req.user.userId,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification.readBy.includes(req.user.userId)) {
      notification.readBy.push(req.user.userId);
      await notification.save();
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
