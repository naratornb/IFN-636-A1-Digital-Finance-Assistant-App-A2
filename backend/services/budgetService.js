import Budget from '../models/Budget.js';
import BudgetRepository from '../repositories/budgetRepository.js';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth
} from 'date-fns';

// OOP Principle: Abstraction Single Responsibility - Service handles only budget-related logic
// abstracts away the complexity of budget creation, including validation, date calculations, and repository operations. Clients of this services only need to provide basic budget data without worrying about implementation details
class BudgetService {
  constructor() {
    this.budgetRepository = new BudgetRepository(Budget);
  }


  async createBudget(budgetData) {
    const { userId, period, totalBudget, notes } = budgetData;

    // Set start and end dates based on period
    let startDate, endDate;
    const now = new Date();

    if (period === 'weekly') {
      startDate = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      endDate = endOfWeek(now, { weekStartsOn: 1 });
    } else { // monthly
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    }

    const budget = {
      userId,
      period,
      totalBudget,
      notes,
      startDate,
      endDate
    };
    return this.budgetRepository.create(budget);
  }

  async getBudgetsByUser(userId) {
    return this.budgetRepository.findByUser(userId);
  }

  async getBudgetById(id, userId) {
  return this.budgetRepository.findById(id, userId);
}

  async updateBudget(id, updateData) {
    return this.budgetRepository.update(id, updateData);
  }

  async deleteBudget(id) {
    return this.budgetRepository.delete(id);
  }
}


export default BudgetService;