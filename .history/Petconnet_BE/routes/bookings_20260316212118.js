const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Test route
router.get('/test', async (req, res) => {
  try {
    const count = await Booking.countDocuments();
    res.json({ message: 'Test successful', count });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ message: 'Test failed', error: error.message });
  }
});

// Simple test route without auth
router.get('/ping', (req, res) => {
  res.json({ message: 'Bookings router is working' });
});

// Get my bookings (current user)
router.get('/my-history', auth, async (req, res) => {
  console.log('=== MY-HISTORY ROUTE CALLED ===');
  try {
    console.log('Fetching booking history for user:', req.user._id);
    console.log('User role:', req.user.role);

    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('freelancerId', 'name email')
      .populate('serviceIds', 'name price')
      .populate('petIds', 'name type')
      .sort({ createdAt: -1 });

    return res.apiSuccess(bookings, 'Booking history retrieved successfully');
  } catch (error) {
    console.error('Error fetching booking history:', error);
    console.error('Error stack:', error.stack);
    return res.apiError('Server error');
  }
});

// Get user booking history (alias for my-history)
router.get('/history', auth, async (req, res) => {
  console.log('=== HISTORY ROUTE CALLED ===');
  try {
    console.log('Fetching booking history for user:', req.user._id);
    console.log('User role:', req.user.role);

    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('freelancerId', 'name email')
      .populate('serviceIds', 'name price')
      .populate('petIds', 'name type')
      .sort({ createdAt: -1 });

    return res.apiSuccess(bookings, 'Booking history retrieved successfully');
  } catch (error) {
    console.error('Error fetching booking history:', error);
    console.error('Error stack:', error.stack);
    return res.apiError('Server error');
  }
});

// Get all bookings (Admin only)
router.get('/getall', auth, requireRole('Admin'), async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const bookings = await Booking.find({})
      .populate('customerId', 'name email')
      .populate('freelancerId', 'name email')
      .populate('serviceIds', 'name price') // Changed from serviceId to serviceIds
      .populate('petIds', 'name type')
      .limit(pageSize * 1)
      .skip((page - 1) * pageSize)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments({});

    return res.apiSuccess({
      items: bookings,
      totalCount: total,
      pageNumber: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    }, 'Bookings retrieved successfully');
  } catch (error) {
    return res.apiError('Server error');
  }
});

// Get recent bookings (Admin only)
router.get('/recent', auth, requireRole('Admin'), async (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const bookings = await Booking.find({})
      .populate('customerId', 'name email')
      .populate('freelancerId', 'name email')
      .populate('serviceIds', 'name price') // Changed from serviceId to serviceIds
      .populate('petIds', 'name type')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.apiSuccess(bookings, 'Recent bookings retrieved successfully');
  } catch (error) {
    return res.apiError('Server error');
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('freelancerId', 'name email')
      .populate('serviceIds') // Changed from serviceId to serviceIds
      .populate('petIds');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.customerId._id.toString() !== req.user._id.toString() &&
        booking.freelancerId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    return res.apiSuccess(booking, 'Booking retrieved successfully');
  } catch (error) {
    return res.apiError('Server error');
  }
});

// Get booking details with payment info
router.get('/:id/details', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('freelancerId', 'name email')
      .populate('serviceId')
      .populate('petIds');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.customerId._id.toString() !== req.user._id.toString() &&
        booking.freelancerId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get payment info
    const Payment = require('../models/Payment');
    const payment = await Payment.findOne({ bookingId: req.params.id });

    res.json({ booking, payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking
router.post('/create', auth, async (req, res) => {
  try {
    const { serviceIds, serviceId, pickUpTime, bookingDate, ...bookingData } = req.body;

    // Handle both serviceIds array and single serviceId for backward compatibility
    const finalServiceIds = serviceIds || (serviceId ? [serviceId] : []);

    if (!finalServiceIds || finalServiceIds.length === 0) {
      return res.status(400).json({ message: 'At least one service is required' });
    }

    // Map frontend fields to backend model fields
    const timeSlotMap = ['Slot1', 'Slot2', 'Slot3', 'Slot4', 'Slot5'];
    const timeSlot = typeof pickUpTime === 'number' ? timeSlotMap[pickUpTime] : pickUpTime;
    const scheduledDate = bookingDate ? new Date(bookingDate) : null;

    if (!scheduledDate || isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ message: 'Invalid booking date' });
    }

    const booking = new Booking({
      ...bookingData,
      serviceIds: finalServiceIds,
      serviceId: finalServiceIds[0], // Keep for backward compatibility
      timeSlot: timeSlot,
      scheduledDate: scheduledDate,
      customerId: req.user._id
    });

    await booking.save();
    await booking.populate(['customerId', 'freelancerId', 'serviceIds', 'petIds']);

    res.status(201).json({ booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.customerId.toString() !== req.user._id.toString() &&
        booking.freelancerId.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate(['customerId', 'freelancerId', 'serviceIds', 'petIds']); // Changed serviceId to serviceIds

    res.json({ booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.put('/status/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.freelancerId.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true
    }).populate(['customerId', 'freelancerId', 'serviceIds', 'petIds']); // Changed serviceId to serviceIds

    res.json({ booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update pickup status
router.put('/pickup-status/:id', auth, async (req, res) => {
  try {
    const { pickUpStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.freelancerId.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { pickUpStatus }, {
      new: true,
      runValidators: true
    }).populate(['customerId', 'freelancerId', 'serviceIds', 'petIds']); // Changed serviceId to serviceIds

    res.json({ booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.put('/cancel/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.customerId.toString() !== req.user._id.toString() &&
        booking.freelancerId.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, {
      status: 'Cancelled'
    }, {
      new: true,
      runValidators: true
    }).populate(['customerId', 'freelancerId', 'serviceIds', 'petIds']); // Changed serviceId to serviceIds

    res.json({ booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's booking history
router.get('/history', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [
        { customerId: req.user._id },
        { freelancerId: req.user._id }
      ]
    })
    .populate('customerId', 'name email')
    .populate('freelancerId', 'name email')
    .populate('serviceIds', 'name price') // Changed from serviceId to serviceIds
    .populate('petIds', 'name type')
    .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error('Get booking history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route
router.get('/test', async (req, res) => {
  try {
    const count = await Booking.countDocuments();
    res.json({ message: 'Test successful', count });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ message: 'Test failed', error: error.message });
  }
});


// Get my bookings (current user)
router.get('/my-history', auth, async (req, res) => {
  console.log('=== MY-HISTORY ROUTE CALLED ===');
  try {
    console.log('Fetching booking history for user:', req.user._id);
    console.log('User role:', req.user.role);

    // First check if user exists
    const user = await User.findById(req.user._id);
    console.log('User found:', !!user);

    // Check total bookings count
    const totalBookings = await Booking.countDocuments();
    console.log('Total bookings in DB:', totalBookings);

    // Check bookings for this user
    const userBookingsCount = await Booking.countDocuments({ customerId: req.user._id });
    console.log('User bookings count:', userBookingsCount);

    const bookings = await Booking.find({ customerId: req.user._id })
      .sort({ createdAt: -1 });

    console.log('Found bookings:', bookings.length);
    if (bookings.length > 0) {
      console.log('Sample booking:', JSON.stringify(bookings[0], null, 2));
    }

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching booking history:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get customer bookings
router.get('/customer/:customerId/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Check authorization
    if (req.user._id.toString() !== req.params.customerId && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ customerId: req.params.customerId })
      .populate('freelancerId', 'name email')
      .populate('serviceId', 'name price')
      .populate('petIds', 'name type')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments({ customerId: req.params.customerId });

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get freelancer bookings
router.get('/freelancer/:freelancerId/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Check authorization
    if (req.user._id.toString() !== req.params.freelancerId && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ freelancerId: req.params.freelancerId })
      .populate('customerId', 'name email')
      .populate('serviceId', 'name price')
      .populate('petIds', 'name type')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments({ freelancerId: req.params.freelancerId });

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;