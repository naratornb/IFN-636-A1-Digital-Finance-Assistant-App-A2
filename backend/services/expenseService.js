import ExpenseRepository from '../repositories/expenseRepository.js';

class ExpenseService {
  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  async createExpense(expenseData) {
    return this.expenseRepository.create(expenseData);
  }

  async getExpensesByUser(userId) {
    return this.expenseRepository.findByUser(userId);
  }

  async getExpensesByUserAndDateRange(userId, startDate, endDate) {
    return this.expenseRepository.findByUserAndDateRange(userId, startDate, endDate);
  }

  async getExpenseById(id) {
    return this.expenseRepository.findById(id);
  }

  async updateExpense(id, updateData) {
    return this.expenseRepository.update(id, updateData);
  }

  async deleteExpense(id) {
    return this.expenseRepository.delete(id);
  }
}

export default ExpenseService;