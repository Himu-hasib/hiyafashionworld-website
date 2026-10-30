const express = require('express');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const categories = await Category.find();
    // ডাটাবেস খালি থাকলে এই ডিফল্ট ডাটাগুলো দেখাবে
    if (categories.length === 0) {
      return res.json([
        { 
          _id: '1', 
          name: 'Three Piece', 
          subCategories: ['Pakistani', 'Indian', 'Bangladeshi', 'Ready Made Three Piece'] 
        },
        { _id: '2', name: 'Kurti', subCategories: [] },
        { _id: '3', name: 'Crochet', subCategories: ['Neck', 'Table Mate', 'Bag', 'Shawl'] },
        { _id: '4', name: 'Bag', subCategories: [] },
        { _id: '5', name: 'Beauty & Accessories', subCategories: [] },
        { _id: '6', name: 'Winter Collection', subCategories: ['Sweater', 'Jacket', 'Shawl'] } 
      ]);
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/admin/add', protect, adminOnly, async (req, res) => {
  const category = await Category.create(req.body);
  res.json(category);
});

router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;