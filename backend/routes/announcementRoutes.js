const express = require('express');
const Announcement = require('../models/Announcement');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload'); // 🔴 নতুন ইমপোর্ট
const router = express.Router();

// সব অ্যানাউন্সমেন্ট দেখা
router.get('/all', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort('-createdAt');
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// নতুন অ্যানাউন্সমেন্ট যোগ করা (ছবি সহ)
router.post('/admin/add', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // 🔴 Cloudinary-তে ছবি আপলোড
    const result = await uploadToCloudinary(req.file.buffer, 'image');

    const announcement = await Announcement.create({
      image: result.secure_url
    });

    res.json(announcement);
  } catch (err) {
    console.error("ANNOUNCEMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// অ্যানাউন্সমেন্ট ডিলিট করা
router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;