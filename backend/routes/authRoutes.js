const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const router = express.Router();

const sign = (u) => jwt.sign({ id: u._id, email: u.email, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, birthDate, password } = req.body;

    if (!phone || phone.length !== 11) {
      return res.status(400).json({ message: 'Phone number must be exactly 11 digits' });
    }

    if (await User.findOne({ $or: [{ email }, { phone }] })) {
      return res.status(400).json({ message: 'Email or Phone already exists' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, phone, birthDate, password: hash });
    
    const notif = await Notification.create({ 
      message: `New user registered: ${name}`, 
      type: 'REGISTER' 
    });

    // 🔴 রিয়েল-টাইম সকেট ইভেন্ট
    req.io.emit('newNotification', notif);
    
    res.json({ message: 'Registered successfully. Please login.' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: sign(user), role: user.role, name: user.name });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;