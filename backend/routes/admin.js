const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { auth, superAdminAuth } = require('../middleware/auth');

const router = express.Router();

// Admin login
router.post('/login', [
  body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;
    
    // Find admin
    const admin = await Admin.findOne({ username, isActive: true });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        _id: admin._id,
        username: admin.username,
        role: admin.role,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Register new admin (requires existing admin)
router.post('/register', 
  auth,
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3-30 characters long')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { username, password } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin with this username already exists' });
      }

      // Create new admin
      const admin = new Admin({
        username,
        password,
        role: 'admin'
      });

      await admin.save();

      res.status(201).json({
        message: 'Admin created successfully',
        admin: {
          _id: admin._id,
          username: admin.username,
          role: admin.role,
          createdAt: admin.createdAt
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Failed to create admin' });
    }
  }
);

// Reset password (requires existing admin)
router.post('/reset-password',
  auth,
  [
    body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { username, newPassword } = req.body;

      const admin = await Admin.findOne({ username, isActive: true });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      admin.password = newPassword;
      await admin.save();

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Failed to reset password' });
    }
  }
);

// Get all admins (requires admin auth)
router.get('/list', auth, async (req, res) => {
  try {
    const admins = await Admin.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Failed to fetch admin list' });
  }
});

// Get current admin info
// Delete admin (requires admin auth)
router.delete('/delete/:username', auth, async (req, res) => {
  try {
    const { username } = req.params;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    if (admin.undeletable) {
      return res.status(403).json({ message: 'Cannot delete default admin' });
    }
    await Admin.deleteOne({ username });
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Failed to delete admin' });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json(req.admin);
});

module.exports = router;