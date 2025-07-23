const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

console.log('Connecting to:', process.env.MONGODB_URI);

async function updatePassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const username = 'its_hassanaziz';
    const newPassword = '30322345.Hassan';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin not found:', username);
      process.exit(0);
    }

    admin.password = hashedPassword;
    await admin.save();
    console.log('Password updated for:', username);
    process.exit(0);
  } catch (err) {
    console.error('Error updating password:', err);
    process.exit(1);
  }
}

updatePassword();
