
/*
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  deadline: { type: Date, required: true },
  paymentMethod: { type: String, default: '' },
  description: { type: String, default: '' }
});

module.exports = mongoose.model('Expense', expenseSchema);
*/

import mongoose from 'mongoose';

const schemaOptions = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
}, schemaOptions);

// Index for faster queries
expenseSchema.index({ userId: 1, deadline: 1 });

// Validation: deadline should be in the future
expenseSchema.path('deadline').validate(function (value) {
  return value >= new Date();
}, 'Deadline must be a future date');

// Virtual example (optional): e.g., status
// expenseSchema.virtual('status').get(function() { ... });

export default mongoose.model('Expense', expenseSchema);
