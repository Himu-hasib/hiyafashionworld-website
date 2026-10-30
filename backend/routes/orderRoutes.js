const express = require('express');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.post('/place', protect, async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.id, status: 'PENDING' };
    data.totalPrice = data.unitPrice * data.quantity;
    const newOrder = await Order.create(data);
    
    await Notification.create({ 
      message: `${data.customerName} ordered one item (${data.productName})`, 
      type: 'ORDER' 
    });
    
    res.json(newOrder);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/my', protect, async (req, res) => res.json(await Order.find({ userId: req.user.id }).sort('-createdAt')));
router.get('/admin/all', protect, adminOnly, async (req, res) => res.json(await Order.find().sort('-createdAt')));
router.get('/admin/pending', protect, adminOnly, async (req, res) => res.json(await Order.find({ status: 'PENDING' })));

router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: 'PENDING' });
    const confirmed = await Order.countDocuments({ status: 'CONFIRMED' });
    const inTransit = await Order.countDocuments({ status: 'IN_TRANSIT' });
    const delivered = await Order.countDocuments({ status: 'DELIVERED' });
    const deliveredOrders = await Order.find({ status: 'DELIVERED' });
    const totalSale = deliveredOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    res.json({ totalOrders, pending, confirmed, inTransit, delivered, totalSale });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/admin/status/:id', protect, adminOnly, async (req, res) => {
  const { status, courierName } = req.body;
  const update = { status };
  if (courierName) update.courierName = courierName;
  res.json(await Order.findByIdAndUpdate(req.params.id, update, { new: true }));
});

module.exports = router;