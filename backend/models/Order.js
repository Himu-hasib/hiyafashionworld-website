const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  productImage: String,
  unitPrice: Number,
  quantity: Number,
  totalPrice: Number,
  customerName: String,
  phone: String,
  secondPhone: String,
  address: String,
  status: { type: String, default: 'PENDING' }, 
  courierName: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);