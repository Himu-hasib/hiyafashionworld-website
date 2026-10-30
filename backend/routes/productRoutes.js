const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// 🔴 কাউন্ট API টি /:id এর আগে রাখতে হবে
router.get('/admin/count', protect, adminOnly, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.json({ totalProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', async (req, res) => res.json(await Product.find().sort('-createdAt')));
router.get('/category/:cat', async (req, res) => res.json(await Product.find({ mainCategory: req.params.cat })));
router.get('/status/:status', async (req, res) => res.json(await Product.find({ status: req.params.status })));
router.get('/search', async (req, res) => res.json(await Product.find({ name: { $regex: req.query.q, $options: 'i' } })));
router.get('/:id', async (req, res) => res.json(await Product.findById(req.params.id)));

router.post('/admin/add', protect, adminOnly, 
  upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), 
  async (req, res) => {
    try {
      const { name, specification, mainCategory, subCategory, price, discount, stockType, status } = req.body;
      let imagePaths = [];
      if (req.files && req.files['images']) {
        imagePaths = req.files['images'].map(file => `http://https://hiyafashionworld-backend.onrender.com/uploads/${file.filename}`);
      }
      let videoPath = '';
      if (req.files && req.files['video'] && req.files['video'].length > 0) {
        videoPath = `http://https://hiyafashionworld-backend.onrender.com/uploads/${req.files['video'][0].filename}`;
      }
      const newProduct = await Product.create({
        name, specification, mainCategory, subCategory,
        price: Number(price), discount: Number(discount),
        images: imagePaths, video: videoPath, stockType, status
      });
      res.json(newProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.put('/admin/:id', protect, adminOnly, 
  upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), 
  async (req, res) => {
    try {
      const { name, specification, mainCategory, subCategory, price, discount, stockType, status } = req.body;
      const updateData = { name, specification, mainCategory, subCategory, price: Number(price), discount: Number(discount), stockType, status };
      if (req.files && req.files['images']) {
        updateData.images = req.files['images'].map(file => `http://https://hiyafashionworld-backend.onrender.com/uploads/${file.filename}`);
      }
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;