import Notification from "../models/Notification.js";
import User from "../models/User.js";

// User ki notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
    const unreadCount = await Notification.count({
      where: { userId: req.user.id, isRead: false },
    });
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Notification read mark karo
export const markAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id } },
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Single notification read karo
export const markOneAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { id: req.params.id, userId: req.user.id } },
    );
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — Sabko notification bhejo
export const sendToAll = async (req, res) => {
  try {
    const { title, message, type = "info" } = req.body;
    if (!title || !message)
      return res.status(400).json({ message: "Title and message required" });

    const users = await User.findAll({ attributes: ["id"] });
    const notifications = users.map((user) => ({
      userId: user.id,
      title,
      message,
      type,
      isRead: false,
    }));

    await Notification.bulkCreate(notifications);
    res.json({ message: `Notification sent to ${users.length} users` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — Single user ko notification bhejo
export const sendToUser = async (req, res) => {
  try {
    const { userId, title, message, type = "info" } = req.body;
    if (!userId || !title || !message)
      return res
        .status(400)
        .json({ message: "UserId, title and message required" });

    await Notification.create({ userId, title, message, type });
    res.json({ message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
