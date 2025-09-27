/*
import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String,
    enum: ['weekly', 'monthly'],
    required: true
  },
  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying by user and period
budgetSchema.index({ userId: 1, period: 1 });

// Virtual for budget status (active/expired)
budgetSchema.virtual('status').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate ? 'active' : 'expired';
});

export default mongoose.model('Budget', budgetSchema);
*/

import mongoose from 'mongoose';

const schemaOptions = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: true
  },
  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, schemaOptions);

// Index for efficient querying
budgetSchema.index({ userId: 1, period: 1 });
budgetSchema.index({ startDate: 1 });
budgetSchema.index({ endDate: 1 });

// Validation: End date after start date
budgetSchema.path('endDate').validate(function(value) {
  return value > this.startDate;
}, 'End date must be after start date');

// Virtual for status
budgetSchema.virtual('status').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate ? 'active' : 'expired';
});

// Static method example
budgetSchema.statics.getActiveBudgets = function(userId) {
  const now = new Date();
  return this.find({ userId, startDate: { $lte: now }, endDate: { $gte: now } });
};

export default mongoose.model('Budget', budgetSchema);