const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cardData: {
    cardNumber: String,
    expiryDate: String,
    cardHolder: String
  }
});

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'VND'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: Number,
    enum: [2, 3], // 2: MoMo, 3: VNPAY
    default: 2
  },
  transactionId: String,
  description: String,
  orderCode: String, // For PayOS
  completedAt: Date,
  refundAmount: Number,
  refundReason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);