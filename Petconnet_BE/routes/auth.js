const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, profile, updateProfile, resetPassword, verifiedResetPassword, disableAccount, verifiedDisableAccount, freelancerProfile, updateCustomerProfile, updateFreelancerProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().isLength({ min: 1 }),
    body('role').optional().isIn(['Customer', 'Freelancer', 'Admin'])
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  login
);

// Logout
router.post('/logout', auth, logout);

// Get current user profile
router.get('/profile/me', auth, profile);

// Get freelancer profile
router.get('/profile/freelancer/me', auth, freelancerProfile);

// Update profile
router.put('/profile/me', auth, updateProfile);

// Update customer profile
router.put('/profile/customer', auth, updateCustomerProfile);

// Update freelancer profile
router.put('/profile/freelancer', auth, updateFreelancerProfile);

// Reset password
router.post('/reset', resetPassword);

// Verified reset password
router.post('/verified/reset', verifiedResetPassword);

// Disable account
router.post('/disable', auth, disableAccount);

// Verified disable account
router.post('/verified/disable', auth, verifiedDisableAccount);

module.exports = router;