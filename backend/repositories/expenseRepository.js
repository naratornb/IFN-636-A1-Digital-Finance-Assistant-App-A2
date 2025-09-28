// repositories/expenseRepository.js
import BaseRepository from './baseRepository.js';
import Expense from '../models/Expense.js';

class ExpenseRepository extends BaseRepository {
  constructor() {
    super(Expense);
  }

  // Add any Expense-specific methods
  async findByUser(userId) {
    return this.model.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}

export default ExpenseRepository;