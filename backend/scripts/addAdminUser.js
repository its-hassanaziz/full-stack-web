const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function addAdminUser() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modhub', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const username = 'its_hassanaziz';
  const password = '30322345.Hassan';
  const role = 'admin';

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log('Admin already exists:', username);
    process.exit(0);
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = new Admin({ username, password: hashedPassword, role, isActive: true });
  await admin.save();
  console.log('Admin created:', username);
  process.exit(0);
}

addAdminUser();
