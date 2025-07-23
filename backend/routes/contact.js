const express = require('express');
const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send email
    await sendEmail({ name, email, message });

    res.status(201).json({ message: 'Form submitted and email sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Submission failed.' });
  }
});

module.exports = router;