const express = require('express');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Subscription pricing
const SUBSCRIPTION_PLANS = {
  monthly: {
    price: 299000, // 299,000đ
    duration: 30, // days
    tier: 'monthly'
  },
  yearly: {
    price: 2990000, // 2,990,000đ
    duration: 365, // days
    tier: 'yearly'
  }
};

// Get current subscription status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('isPremium subscriptionTier subscriptionEndDate subscriptionStatus');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if subscription expired
    if (user.subscriptionEndDate && new Date(user.subscriptionEndDate) < new Date()) {
      user.subscriptionStatus = 'expired';
      user.isPremium = false;
      await user.save();
    }

    res.json({
      isPremium: user.isPremium,
      tier: user.subscriptionTier,
      status: user.subscriptionStatus,
      endDate: user.subscriptionEndDate
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upgrade to VIP subscription
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    
    // Validate plan
    if (!plan || !SUBSCRIPTION_PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    const planInfo = SUBSCRIPTION_PLANS[plan];
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate new dates
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + planInfo.duration * 24 * 60 * 60 * 1000);

    // Create subscription payment record
    const payment = new Payment({
      userId: req.user._id,
      amount: planInfo.price,
      paymentMethod: 2, // Default to MoMo for subscriptions
      description: `VIP Subscription - ${plan.toUpperCase()}`,
      orderCode: `SUB_${Date.now()}_${req.user._id.toString().slice(-6)}`,
      status: 'pending',
      adminApprovalStatus: 'pending'
    });

    await payment.save();

    // Update user subscription (pending payment approval)
    user.subscriptionTier = planInfo.tier;
    user.subscriptionStartDate = startDate;
    user.subscriptionEndDate = endDate;
    user.subscriptionStatus = 'pending'; // Will be 'active' after admin approval
    await user.save();

    console.log('Subscription upgrade initiated:', {
      userId: req.user._id,
      plan,
      amount: planInfo.price,
      paymentId: payment._id
    });

    res.status(201).json({
      message: 'Subscription upgrade initiated. Waiting for payment confirmation.',
      paymentId: payment._id,
      subscriptionId: user._id,
      plan: planInfo.tier,
      amount: planInfo.price,
      startDate,
      endDate,
      status: 'pending_payment'
    });
  } catch (error) {
    console.error('Subscription upgrade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel subscription
router.post('/cancel', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isPremium) {
      return res.status(400).json({ message: 'User is not a premium member' });
    }

    // Cancel subscription
    user.isPremium = false;
    user.subscriptionStatus = 'cancelled';
    user.subscriptionAutoRenew = false;
    await user.save();

    console.log('Subscription cancelled:', {
      userId: req.user._id,
      timestamp: new Date()
    });

    res.json({
      message: 'Subscription cancelled successfully',
      subscriptionStatus: 'cancelled'
    });
  } catch (error) {
    console.error('Subscription cancel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Renew subscription (admin endpoint)
router.put('/:userId/renew', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Activate premium subscription
    user.isPremium = true;
    user.subscriptionStatus = 'active';
    await user.save();

    console.log('Subscription activated:', {
      userId: req.params.userId,
      tier: user.subscriptionTier,
      endDate: user.subscriptionEndDate
    });

    res.json({
      message: 'Subscription activated successfully',
      isPremium: user.isPremium,
      status: user.subscriptionStatus
    });
  } catch (error) {
    console.error('Subscription renewal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
