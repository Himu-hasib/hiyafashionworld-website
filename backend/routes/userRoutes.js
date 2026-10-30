const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// 🔴 কাউন্ট API টি আগে রাখতে হবে
router.get('/admin/count', protect, adminOnly, async (req, res) => {
  try {
    const totalBuyers = await User.countDocuments({ role: 'USER' });
    res.json({ totalBuyers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => res.json(await User.findById(req.user.id).select('-password')));

router.put('/me', protect, async (req, res) => {
  const allowed = ['name', 'phone', 'address', 'profilePic'];
  const update = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
  res.json(await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password'));
});

router.put('/me/password', protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return res.status(400).json({ message: 'Incorrect old password' });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password updated' });
});

router.get('/admin/buyers', protect, adminOnly, async (req, res) => res.json(await User.find({ role: 'USER' }).select('-password')));

module.exports = router;