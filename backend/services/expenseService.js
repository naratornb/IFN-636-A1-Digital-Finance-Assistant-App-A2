// services/expenseService.js
import ExpenseRepository from '../repositories/expenseRepository.js';

class ExpenseService {
  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  async getExpensesByUser(userId) {
    return this.expenseRepository.find({ userId });
  }

  async createExpense(data) {
    // Add custom logic/validation if needed
    return this.expenseRepository.create(data);
  }

  async getExpenseById(id) {
    return this.expenseRepository.findById(id);
  }

  async updateExpense(id, data) {
    return this.expenseRepository.update(id, data);
  }

  async deleteExpense(id) {
    return this.expenseRepository.delete(id);
  }
}

export default new ExpenseService();