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
  target: {
    type: Number,
    required: true,
    min: 0
  },
  current: {
    type: Number,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  }
}, schemaOptions);

goalSchema.index({ userId: 1, deadline: 1 });

goalSchema.path('deadline').validate(function (value) {
  return value >= new Date();
}, 'Deadline must be a future date');

goalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const diffMs = this.deadline - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
});

goalSchema.virtual('status').get(function() {
  const now = new Date();
  return now <= this.deadline ? 'active' : 'expired';
});

goalSchema.statics.getOverdueGoals = function(userId) {
  const now = new Date();
  return this.find({ userId, deadline: { $lt: now } });
};

export default mongoose.model('Goal', goalSchema);