const express = require('express');
const Notification = require('../models/Notification');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Pagination সহ সব নোটিফিকেশন লোড
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
      
    const total = await Notification.countDocuments();

    res.json({
      data: notifications,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// সব নোটিফিকেশন রিড (পড়া হয়েছে) হিসেবে মার্ক করা
router.put('/admin/read-all', protect, adminOnly, async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ message: 'All read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// আনরিড নোটিফিকেশনের সংখ্যা কাউন্ট
router.get('/admin/unread-count', protect, adminOnly, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;