const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);

// সকেট কনফিগারেশন (সব লিংক থেকে অ্যালাউ করা হলো)
const io = new Server(server, {
  cors: { 
    origin: "*", // 🔴 টেস্টিংয়ের জন্য সব লিংক অ্যালাউ
    methods: ["GET", "POST", "PUT", "DELETE"] 
  }
});

// 🔴 CORS সেটিংস (সব লিংক থেকে রিকোয়েস্ট অ্যালাউ)
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// req.io এর মাধ্যমে রাউট থেকে সকেট কল করা যাবে
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// সকেট কানেকশন
io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);
  socket.on('disconnect', () => console.log('❌ User disconnected'));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    server.listen(process.env.PORT || 5000, () => console.log(`🚀 Server on port ${process.env.PORT}`));
  })
  .catch(err => console.error('❌ DB Error:', err));