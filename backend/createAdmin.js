const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User'); // আপনার User মডেলের পাথ

dotenv.config();

const createAdmin = async () => {
  try {
    // MongoDB কানেক্ট
    await mongoose.connect(process.env.MONGO_URI);
    
    // অ্যাডমিনের তথ্য (আপনি চাইলে পরিবর্তন করতে পারেন)
    const adminEmail = 'admin@myshop.com';
    const adminPhone = '01700000000';
    const adminPassword = 'admin123';

    // চেক করা: এই ইমেইল বা ফোনে আগে থেকে কোনো ইউজার আছে কিনা
    const existing = await User.findOne({ $or: [{ email: adminEmail }, { phone: adminPhone }] });
    if (existing) {
      console.log('⚠️ Admin already exists!');
      process.exit();
    }

    // পাসওয়ার্ড হ্যাশ করা
    const hash = await bcrypt.hash(adminPassword, 10);

    // নতুন অ্যাডমিন তৈরি
    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      phone: adminPhone,
      birthDate: '1990-01-01',
      password: hash,
      role: 'ADMIN'
    });

    console.log('✅ Admin created successfully!');
    console.log('=================================');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`📱 Phone: ${adminPhone}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('=================================');
    process.exit();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();