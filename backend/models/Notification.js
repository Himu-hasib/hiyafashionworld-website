const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: String,
  type: String, // 'ORDER', 'REGISTER', 'CART'
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);