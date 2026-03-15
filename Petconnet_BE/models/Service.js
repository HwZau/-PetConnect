const mongoose = require('mongoose');

const serviceAddonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isRequired: {
    type: Boolean,
    default: false
  }
});

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1
  },
  category: {
    type: String,
    enum: ['grooming', 'training', 'boarding', 'walking', 'veterinary', 'other'],
    required: true
  },
  requirements: [String],
  addOns: [serviceAddonSchema],
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);