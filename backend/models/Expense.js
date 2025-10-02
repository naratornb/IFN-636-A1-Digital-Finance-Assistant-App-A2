const mongoose = require('mongoose');

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

expenseSchema.index({ userId: 1, date: -1 });

expenseSchema.index({ userId: 1, category: 1 });

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
