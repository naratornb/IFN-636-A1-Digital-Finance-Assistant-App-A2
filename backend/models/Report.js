
/*
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    reportdate: { type: Date },
});

module.exports = mongoose.model('Report', reportSchema);
*/

import mongoose from 'mongoose';

const schemaOptions = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  reportdate: {
    type: Date
  }
}, schemaOptions);

// Example index for faster queries on userId
reportSchema.index({ userId: 1 });

// Optional: add validation or virtuals here

export default mongoose.model('Report', reportSchema);