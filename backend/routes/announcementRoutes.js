const express = require('express');
const Announcement = require('../models/Announcement');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/all', async (req, res) => res.json(await Announcement.find().sort('-createdAt')));

// ✅ Image Upload for Announcement
router.post('/admin/add', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    const imagePath = `http://localhost:5000/uploads/${req.file.filename}`;
    const ann = await Announcement.create({ image: imagePath });
    res.json(ann);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;