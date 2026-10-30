const express = require('express');
const User = require('../models/User');
const Notification = require('../models/Notification'); 
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/my', protect, async (req, res) => {
  const u = await User.findById(req.user.id);
  res.json(u.cart || []);
});

router.post('/add', protect, async (req, res) => {
  try {
    const u = await User.findById(req.user.id);
    u.cart.push(req.body);
    await u.save();

    await Notification.create({ 
      message: `${u.name} added one item (${req.body.name}) to cart`, 
      type: 'CART' 
    });

    res.json(u.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/remove/:index', protect, async (req, res) => {
  const u = await User.findById(req.user.id);
  u.cart.splice(req.params.index, 1);
  await u.save();
  res.json(u.cart);
});

module.exports = router;