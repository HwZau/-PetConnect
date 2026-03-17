const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  avatarUrl: {
    type: String
  },
  role: {
    type: String,
    enum: ['Customer', 'Freelancer', 'Admin'],
    default: 'Customer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  location: {
    type: String
  },
  memberSince: {
    type: Date,
    default: Date.now
  },
  // VIP/Premium Subscription fields
  isPremium: {
    type: Boolean,
    default: false
  },
  subscriptionTier: {
    type: String,
    enum: ['standard', 'monthly', 'yearly'],
    default: 'standard'
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ['inactive', 'pending', 'active', 'expired', 'cancelled'],
    default: 'inactive'
  },
  subscriptionAutoRenew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  userObject.id = userObject._id.toString();
  delete userObject._id;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);