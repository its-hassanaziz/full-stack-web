const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

async function listAdmins() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modhub', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const admins = await Admin.find({});
  console.log('Admins:', admins);
  process.exit(0);
}

listAdmins();
