const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  specification: String,
  mainCategory: String, 
  subCategory: String,  
  price: Number,
  discount: { type: Number, default: 0 },
  images: [String],      
  video: String,
  stockType: { type: String, default: 'IN_STOCK' }, 
  status: { type: String, default: 'NORMAL' }       
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);