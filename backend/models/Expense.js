

import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: false },
  category: { type: String, required: true, enum: ['Housing','Transportation','Food','Utilities','Healthcare','Insurance','Debt','Entertainment','Personal','Savings','Other'] },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, default: '', trim: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

expenseSchema.virtual('size').get(function() {
  return this.amount > 100 ? 'big' : 'small';
});


expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Expense', expenseSchema);