const express = require('express');
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all freelancers
router.get('/getall', async (req, res) => {
  try {
    const { page = 1, limit = 10, size } = req.query;
    const pageSize = size || limit;

    const freelancers = await User.find({ role: 'Freelancer', isActive: true })
      .select('-password')
      .limit(pageSize * 1)
      .skip((page - 1) * pageSize);

    const total = await User.countDocuments({ role: 'Freelancer', isActive: true });

    // Add stats for each freelancer
    const freelancersWithStats = await Promise.all(
      freelancers.map(async (freelancer) => {
        const services = await Service.find({ freelancer: freelancer._id });
        const completedBookings = await Booking.countDocuments({
          freelancerId: freelancer._id,
          status: 'Completed'
        });

        return {
          ...freelancer.toObject(),
          services,
          stats: {
            completedJobs: completedBookings,
            servicesCount: services.length
          }
        };
      })
    );

    res.json({
      items: freelancersWithStats,
      totalCount: total,
      pageNumber: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get freelancer by ID
router.get('/:id', async (req, res) => {
  try {
    const freelancer = await User.findOne({
      _id: req.params.id,
      role: 'Freelancer',
      isActive: true
    }).select('-password');

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Get freelancer's services
    const services = await Service.find({ freelancer: req.params.id, isActive: true });

    // Get freelancer stats
    const completedBookings = await Booking.countDocuments({
      freelancerId: req.params.id,
      status: 'Completed'
    });

    const totalBookings = await Booking.countDocuments({
      freelancerId: req.params.id
    });

    const stats = {
      completedJobs: completedBookings,
      totalBookings,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0
    };

    res.json({
      freelancer: {
        ...freelancer.toObject(),
        services,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search freelancers
router.get('/search', async (req, res) => {
  try {
    const { q, location, category } = req.query;
    let query = { role: 'Freelancer', isActive: true };

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const freelancers = await User.find(query).select('-password');

    // Filter by category if specified
    let filteredFreelancers = freelancers;
    if (category) {
      const freelancerIds = await Service.distinct('freelancer', { category });
      filteredFreelancers = freelancers.filter(freelancer =>
        freelancerIds.some(id => id.toString() === freelancer._id.toString())
      );
    }

    res.json({ freelancers: filteredFreelancers });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get freelancer reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    // This would typically involve a Review model
    // For now, return empty array
    res.json({ reviews: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get freelancer portfolio (services)
router.get('/:id/portfolio', async (req, res) => {
  try {
    const services = await Service.find({
      freelancer: req.params.id,
      isActive: true
    });

    res.json({ portfolio: services });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;