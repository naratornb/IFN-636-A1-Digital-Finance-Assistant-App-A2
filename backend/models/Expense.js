
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
