const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  nextDue: {
    type: Date
  }
});

const petSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['dog', 'cat', 'bird', 'other'],
    required: true
  },
  breed: {
    type: String
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String
  },
  specialNeeds: {
    type: String
  },
  medicalHistory: {
    type: String
  },
  vaccinations: [vaccinationSchema],
  imageUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

// Virtual fields for frontend compatibility
petSchema.virtual('petId').get(function () {
  return this._id.toString();
});

petSchema.virtual('petName').get(function () {
  return this.name;
});

petSchema.virtual('species').get(function () {
  return this.type;
});

module.exports = mongoose.model('Pet', petSchema);