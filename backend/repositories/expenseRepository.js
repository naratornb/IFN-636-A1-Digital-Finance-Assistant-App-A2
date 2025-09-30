import BaseRepository from './baseRepository.js';
import Expense from '../models/Expense.js';

class ExpenseRepository extends BaseRepository {
  constructor() {
    super(Expense);
  }

  // Additional methods specific to Expense
  async findByUser(userId) {
    return this.model.find({ userId }).sort({ date: -1 });
  }

  async findByUserAndDateRange(userId, startDate, endDate) {
    return this.model.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: -1 });
  }

  async findByBudget(budgetId) {
    return this.model.find({ budgetId });
  }
}

export default ExpenseRepository;
