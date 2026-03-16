const express = require('express');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/getall', auth, requireRole('Admin'), async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const users = await User.find({})
      .select('-password')
      .limit(pageSize * 1)
      .skip((page - 1) * pageSize);

    const total = await User.countDocuments({});

    res.json({
      items: users,
      totalCount: total,
      pageNumber: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', auth, async (req, res) => {
  try {
    // Users can only update their own profile unless they're admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = ['name', 'phoneNumber', 'address', 'avatarUrl', 'preferences', 'isActive'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (Admin only)
router.delete('/:id', auth, requireRole('Admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user (Admin only)
router.post('/create', auth, requireRole('Admin'), async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      email,
      password,
      name,
      role: role || 'Customer'
    });

    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get freelancer profile (duplicate endpoint for compatibility)
router.get('/freelancer_profile/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'Freelancer') {
      return res.status(404).json({ message: 'Freelancer profile not found' });
    }

    // Get freelancer's services
    const Service = require('../models/Service');
    const services = await Service.find({ freelancer: user._id });

    res.json({
      user,
      services,
      stats: {
        totalServices: services.length,
        activeServices: services.filter(s => s.isActive).length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;