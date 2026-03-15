const mongoose = require('mongoose');

const customerInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
});

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  petIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  }],
  scheduledDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    enum: ['Slot1', 'Slot2', 'Slot3', 'Slot4', 'Slot5'],
    required: true
  },
  specialRequests: String,
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  pickUpStatus: {
    type: String,
    enum: ['NotPickedUp', 'PickedUp', 'Delivered'],
    default: 'NotPickedUp'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  customerInfo: customerInfoSchema,
  addOns: [{
    name: String,
    price: Number,
    isRequired: Boolean
  }],
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    notes: String,
    updatedBy: { type: String, enum: ['customer', 'freelancer', 'system'] }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for bookingId
bookingSchema.virtual('bookingId').get(function() {
  return this._id.toString();
});

// Add status change to history
bookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      updatedAt: new Date(),
      updatedBy: 'system'
    });
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);