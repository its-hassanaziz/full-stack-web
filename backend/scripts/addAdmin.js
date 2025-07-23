const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

async function addAdmin() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modhub', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Add first admin
  const email1 = 'admin@example.com';
  const password1 = 'admin123';
  const existing1 = await Admin.findOne({ email: email1 });
  if (!existing1) {
    const admin1 = new Admin({ email: email1, password: password1 });
    await admin1.save();
    console.log('Admin created:', email1);
  } else {
    console.log('Admin already exists:', email1);
  }

  // Add second admin
  const email2 = 'its_hassanaziz';
  const password2 = '30322345.Hassan';
  const existing2 = await Admin.findOne({ email: email2 });
  if (!existing2) {
    const admin2 = new Admin({ email: email2, password: password2 });
    await admin2.save();
    console.log('Admin created:', email2);
  } else {
    console.log('Admin already exists:', email2);
  }

  process.exit(0);
}

addAdmin();
