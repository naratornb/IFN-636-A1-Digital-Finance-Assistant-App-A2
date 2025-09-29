import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
    required: false
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Housing', 'Transportation', 'Food', 'Utilities',
      'Healthcare', 'Insurance', 'Debt', 'Entertainment',
      'Personal', 'Savings', 'Other'
    ]
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient querying by user and date
expenseSchema.index({ userId: 1, date: -1 });

// Index for category-based queries
expenseSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Expense', expenseSchema);
