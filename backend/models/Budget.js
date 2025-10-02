import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  period: { type: String, enum: ['weekly', 'monthly'], required: true },
  totalBudget: { type: Number, required: true, min: 0 },
  notes: { type: String, default: '', trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual for status (active/expired)
budgetSchema.virtual('status').get(function() {
  return new Date() > this.endDate ? 'expired' : 'active';
});

export default mongoose.model('Budget', budgetSchema);