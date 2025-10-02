
import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  target: { type: Number, required: true, min: 0 },
  current: { type: Number, default: 0, min: 0 },
  deadline: { type: Date, required: true }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });


goalSchema.path('deadline').validate(date => date >= new Date(), 'Deadline must be in the future');


goalSchema.virtual('daysRemaining').get(function() {
  return Math.ceil((this.deadline - new Date()) / (1000 * 60 * 60 * 24));
});

goalSchema.virtual('status').get(function() {
  return new Date() <= this.deadline ? 'active' : 'expired';
});


goalSchema.statics.getOverdueGoals = function(userId) {
  return this.find({ userId, deadline: { $lt: new Date() } });
};

export default mongoose.model('Goal', goalSchema);