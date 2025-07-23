const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

console.log('Connecting to:', process.env.MONGODB_URI); // Debug connection string

async function deleteAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const username = 'its_hassanaziz';
    const result = await Admin.deleteOne({ username });
    if (result.deletedCount > 0) {
      console.log('Admin deleted:', username);
    } else {
      console.log('Admin not found:', username);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error connecting or deleting admin:', err);
    process.exit(1);
  }
}

deleteAdminUser();
