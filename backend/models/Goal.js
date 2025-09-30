/*
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  deadline: { type: Date },
});

module.exports = mongoose.model('Goal', goalSchema);
*/
import mongoose from 'mongoose';

const schemaOptions = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

const goalSchema = new mongoose.Schema({
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
  }
}, schemaOptions);

// Index for efficient querying
goalSchema.index({ userId: 1, deadline: 1 });

// Validation: deadline should be in the future
goalSchema.path('deadline').validate(function (value) {
  return value >= new Date();
}, 'Deadline must be a future date');

// Virtual: days remaining until deadline
goalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const diffMs = this.deadline - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
});

// Static method example: get overdue goals
goalSchema.statics.getOverdueGoals = function(userId) {
  const now = new Date();
  return this.find({ userId, deadline: { $lt: now } });
};

export default mongoose.model('Goal', goalSchema);