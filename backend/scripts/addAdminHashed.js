const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

console.log('Connecting to:', process.env.MONGODB_URI); // Debug connection string

async function addAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const username = 'its_hassanaziz';
    const password = '30322345.Hassan';
    const role = 'admin';

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log('Admin already exists:', username);
      process.exit(0);
    }

    const admin = new Admin({ username, password, role, isActive: true });
    await admin.save();
    console.log('Admin created:', username);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

addAdminUser();
