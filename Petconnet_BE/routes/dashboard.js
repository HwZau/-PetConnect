const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get total counts
    const [totalFreelancers, totalCustomers, totalBookings, totalRevenue] = await Promise.all([
      User.countDocuments({ role: 'Freelancer' }),
      User.countDocuments({ role: 'Customer' }),
      Booking.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    // Calculate revenue
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Get active jobs (bookings that are not completed or cancelled)
    const activeJobs = await Booking.countDocuments({
      status: { $nin: ['Completed', 'Cancelled'] }
    });

    // Calculate growth rate (simplified - compare this month vs last month)
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
      Payment.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: lastMonth, $lt: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const thisMonthTotal = thisMonthRevenue.length > 0 ? thisMonthRevenue[0].total : 0;
    const lastMonthTotal = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0;

    const growthRate = lastMonthTotal > 0
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : (thisMonthTotal > 0 ? 100 : 0);

    res.apiSuccess({
      totalFreelancers,
      totalCustomers,
      activeJobs,
      totalRevenue: revenue,
      growthRate: Math.round(growthRate * 100) / 100 // Round to 2 decimal places
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;