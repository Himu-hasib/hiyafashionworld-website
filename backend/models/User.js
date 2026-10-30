const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: String, name: String, price: Number, image: String, quantity: { type: Number, default: 1 }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  birthDate: String,
  password: String,
  address: String,
  profilePic: String,
  role: { type: String, default: 'USER' },
  cart: [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);