const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Pet = require('../models/Pet');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, phoneNumber, address, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      email,
      password,
      name,
      phoneNumber,
      address,
      role: role || 'Customer'
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email });
    console.log('User found:', !!user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing password');
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    user.lastLoginAt = new Date();
    console.log('Saving user');
    await user.save();
    console.log('User saved');

    const token = generateToken(user._id);
    console.log('Token generated');

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Populate user's pets
    const Pet = require('../models/Pet');
    const pets = await Pet.find({ owner: user._id, status: 'active' }).select('-__v');

    const userWithPets = user.toObject();
    userWithPets.pets = pets;

    res.json({ user: userWithPets });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phoneNumber', 'address', 'avatarUrl', 'preferences'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Populate user's pets
    const Pet = require('../models/Pet');
    const pets = await Pet.find({ owner: user._id, status: 'active' }).select('-__v');

    const userWithPets = user.toObject();
    userWithPets.pets = pets;

    res.json({ user: userWithPets });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token (simplified - in production use proper token generation)
    const resetToken = generateToken(user._id);
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In production, send email with reset link
    res.json({ message: 'Password reset email sent', resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifiedResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const disableAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate verification token for account disable
    const disableToken = generateToken(user._id);
    user.disableToken = disableToken;
    user.disableTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    res.json({ message: 'Account disable verification sent', disableToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifiedDisableAccount = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({
      disableToken: token,
      disableTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired disable token' });
    }

    user.isActive = false;
    user.disableToken = undefined;
    user.disableTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Account disabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const freelancerProfile = async (req, res) => {
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
};

const updateCustomerProfile = async (req, res) => {
  try {
    if (req.user.role !== 'Customer' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = ['name', 'phoneNumber', 'address', 'avatarUrl', 'preferences'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== '') {
        updates[field] = req.body[field];
      }
    });

    // If no valid updates, return current user
    if (Object.keys(updates).length === 0) {
      const user = await User.findById(req.user._id).select('-password');
      return res.json({ user });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json({ user });
  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateFreelancerProfile = async (req, res) => {
  try {
    if (req.user.role !== 'Freelancer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = ['name', 'phoneNumber', 'address', 'avatarUrl', 'preferences', 'bio', 'location', 'experience', 'certifications'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== '') {
        updates[field] = req.body[field];
      }
    });

    // If no valid updates, return current user
    if (Object.keys(updates).length === 0) {
      const user = await User.findById(req.user._id).select('-password');
      return res.json({ user });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json({ user });
  } catch (error) {
    console.error('Update freelancer profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  logout,
  profile,
  updateProfile,
  resetPassword,
  verifiedResetPassword,
  disableAccount,
  verifiedDisableAccount,
  freelancerProfile,
  updateCustomerProfile,
  updateFreelancerProfile
};
