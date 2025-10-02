
import ExpenseRepository from '../repositories/expenseRepository.js';
import ExpenseFactory from './expenseFactory.js';

class ExpenseService {
  constructor() {
    if (ExpenseService.instance) return ExpenseService.instance;
    this.expenseRepository = ExpenseRepository;
    ExpenseService.instance = this;
  }

  async createExpense(expenseData, type = 'one-time') {
    const expenseObj = ExpenseFactory.createExpense(expenseData, type);
    return this.expenseRepository.create(expenseObj);
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

export default new ExpenseService(); 