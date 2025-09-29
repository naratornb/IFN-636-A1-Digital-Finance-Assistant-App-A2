const mongoose = require('mongoose');

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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient querying by user and period
budgetSchema.index({ userId: 1, period: 1 });

// Virtual for budget status (active/expired)
budgetSchema.virtual('status').get(function() {
  const now = new Date();
  return now > this.endDate ? 'expired' : 'active';
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
