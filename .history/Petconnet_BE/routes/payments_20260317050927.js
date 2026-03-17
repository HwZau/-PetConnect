const express = require('express');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create payment
router.post('/create', auth, async (req, res) => {
  try {
    const { bookingId, method, returnUrl, description } = req.body;

    console.log('Payment creation request:', { bookingId, method, returnUrl, description });

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.log('Booking not found:', bookingId);
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customerId.toString() !== req.user._id.toString()) {
      console.log('User not authorized for booking:', { userId: req.user._id, customerId: booking.customerId });
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ bookingId });
    if (existingPayment) {
      console.log('Payment already exists for booking:', bookingId);
      return res.status(400).json({ message: 'Payment already exists for this booking' });
    }

    const payment = new Payment({
      bookingId,
      userId: req.user._id,
      amount: booking.totalAmount,
      paymentMethod: method,
      description: description || 'DV cham soc thu cung',
      orderCode: `ORDER_${Date.now()}_${bookingId.slice(-6)}`
    });

    await payment.save();

    // Supported payment methods (Option C: Both MoMo and TPBank)
    const paymentMethods = {
      2: {
        name: 'MoMo',
        account: '0834339521',
        recipientName: 'Nguyễn Hữu Giàu',
        bankCode: 'MOMO'
      },
      3: {
        name: 'TPBank',
        account: '02600647401',
        recipientName: 'richdesu',
        bankCode: 'TPBVN',
        bankName: 'TPBank'
      }
    };

    const methodDetails = paymentMethods[method];
    if (!methodDetails) {
      console.log('Unsupported payment method:', method);
      return res.status(400).json({ message: 'Unsupported payment method. Vui lòng chọn MoMo hoặc VNPAY.' });
    }

    // Create VietQR format for payment (EMVCo compatible)
    // Format: ACCOUNT|RECIPIENT_NAME|AMOUNT|DESCRIPTION
    // QR apps (MoMo, VNPAY, Napas247, VietQR) can parse this
    const qrData = `${methodDetails.account}|${methodDetails.recipientName}|${booking.totalAmount}|Thanh toan dich vu Pet Connect - ${payment.orderCode}`;

    console.log('Payment created successfully:', { 
      paymentId: payment._id, 
      method, 
      methodName: methodDetails.name,
      amount: booking.totalAmount, 
      qrData 
    });

    res.status(201).json({
      paymentId: payment._id,
      bookingId,
      method,
      methodName: methodDetails.name,
      bankCode: methodDetails.bankCode,
      bankName: methodDetails.bankName || methodDetails.name,
      accountNumber: methodDetails.account,
      recipientName: methodDetails.recipientName,
      qrData,
      status: 'pending',
      amount: booking.totalAmount,
      currency: 'VND'
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all payments (Admin only) - alias for frontend compatibility
router.get('/getall', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { page = 1, pageSize = 10 } = req.query;

    const payments = await Payment.find({})
      .populate('userId', 'name email')
      .populate('bookingId')
      .limit(pageSize * 1)
      .skip((page - 1) * pageSize)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments({});

    res.json({
      items: payments,
      totalCount: total,
      pageNumber: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all payments (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { page = 1, pageSize = 10 } = req.query;

    const payments = await Payment.find({})
      .populate('userId', 'name email')
      .populate('bookingId')
      .limit(pageSize * 1)
      .skip((page - 1) * pageSize)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments({});

    res.json({
      items: payments,
      totalCount: total,
      pageNumber: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent payments (Admin only)
router.get('/recent', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { limit = 3 } = req.query;

    const payments = await Payment.find({})
      .populate('userId', 'name email')
      .populate('bookingId')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Get recent payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment by booking ID
router.get('/booking/:bookingId', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ bookingId: req.params.bookingId })
      .populate('userId', 'name email')
      .populate('bookingId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check authorization
    if (payment.userId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment status by booking ID (for polling)
router.get('/:bookingId/status', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ bookingId: req.params.bookingId })
      .populate('userId', 'name email')
      .populate('bookingId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check authorization
    if (payment.userId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ 
      status: payment.status,
      paymentId: payment._id,
      bookingId: payment.bookingId,
      amount: payment.amount,
      updatedAt: payment.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment by ID
router.get('/:paymentId', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('userId', 'name email')
      .populate('bookingId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check authorization
    if (payment.userId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment status
router.put('/:paymentId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Only admin can update payment status
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.paymentId,
      {
        status,
        ...(status === 'completed' && { completedAt: new Date() })
      },
      { new: true }
    ).populate(['userId', 'bookingId']);

    // Update booking payment status if payment is completed
    if (status === 'completed') {
      await Booking.findByIdAndUpdate(payment.bookingId, {
        paymentStatus: 'paid'
      });
    }

    res.json({ payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm payment (user can confirm after transferring money via QR code)
router.post('/:paymentId/confirm', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Only the user who made the payment or an admin can confirm
    if (payment.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (payment.status === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    payment.status = 'completed';
    payment.completedAt = new Date();
    await payment.save();

    // Update booking payment status
    await Booking.findByIdAndUpdate(payment.bookingId, {
      paymentStatus: 'paid'
    });

    res.json({ payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel payment
router.put('/:paymentId/cancel', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check authorization
    if (payment.userId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (payment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed payment' });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.paymentId,
      { status: 'refunded' },
      { new: true }
    ).populate(['userId', 'bookingId']);

    // Update booking payment status
    await Booking.findByIdAndUpdate(payment.bookingId, {
      paymentStatus: 'refunded'
    });

    res.json({ payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment status by booking ID
router.get('/:bookingId/status', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ bookingId: req.params.bookingId })
      .populate('userId', 'name email')
      .populate('bookingId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found for this booking' });
    }

    // Check authorization - user should be able to check their own payments
    if (payment.userId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      status: payment.status,
      paymentId: payment._id,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      createdAt: payment.createdAt,
      completedAt: payment.completedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PayOS callback
router.post('/payos-callback', async (req, res) => {
  try {
    // For local development, just log the callback and return success
    console.log('PayOS callback received:', req.body);

    const { orderCode, amount, status } = req.body;

    // In local development, simulate payment processing
    if (process.env.NODE_ENV === 'development') {
      console.log('Local development: Simulating payment processing');
      return res.json({
        message: 'Payment callback processed (development mode)',
        orderCode,
        status: status || 'success'
      });
    }

    // Find payment by order code (assuming orderCode is stored in payment)
    const payment = await Payment.findOne({ orderCode });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment status based on PayOS callback
    if (status === 'success') {
      payment.status = 'completed';
      payment.completedAt = new Date();

      // Update booking payment status
      await Booking.findByIdAndUpdate(payment.bookingId, {
        paymentStatus: 'paid'
      });
    } else if (status === 'failed') {
      payment.status = 'failed';
    }

    await payment.save();

    res.json({ message: 'Payment callback processed' });
  } catch (error) {
    console.error('PayOS callback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;