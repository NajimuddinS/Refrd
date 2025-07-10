const mongoose = require('mongoose');
const validator = require('validator');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Hired', 'Rejected'],
    default: 'Pending',
  },
  resumeUrl: {
    type: String,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

candidateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;