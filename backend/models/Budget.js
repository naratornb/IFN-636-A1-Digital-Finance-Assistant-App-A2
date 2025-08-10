
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  saved: { type: Number, required: true },
  amount: { type: Number, required: true },
  deadline: { type: Date },
  status: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Budget', budgetSchema);
