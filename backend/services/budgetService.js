import BudgetRepository from '../repositories/budgetRepository.js';
import { startOfWeek, startOfMonth, addDays, addMonths, subDays } from 'date-fns';

class WeeklyStrategy {
  calculateDates(startDate) {
    const start = startOfWeek(startDate, { weekStartsOn: 1 });
    const end = addDays(new Date(start), 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
}

class MonthlyStrategy {
  calculateDates(startDate) {
    const start = startOfMonth(startDate);
    const nextMonth = addMonths(new Date(start), 1);
    const end = subDays(nextMonth, 1);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
}

class BudgetFactory {
  static createBudget({ userId, period, totalBudget, notes, startDate, strategy }) {
    const { start, end } = strategy.calculateDates(startDate);
    return { userId, period, totalBudget, notes, startDate: start, endDate: end };
  }
}

// Singleton BudgetService
class BudgetService {
  constructor() {

    if (BudgetService.instance) return BudgetService.instance;

    this.budgetRepository = new BudgetRepository();
    BudgetService.instance = this;
  }

  async createBudget({ userId, period, totalBudget, notes, startDate }) {
    const date = startDate ? new Date(startDate) : new Date();
    const strategy = period === 'weekly' ? new WeeklyStrategy() : new MonthlyStrategy();

    const budgetData = BudgetFactory.createBudget({ userId, period, totalBudget, notes, startDate: date, strategy });
    return this.budgetRepository.create(budgetData);
  }

  async getBudgetsByUser(userId) {
    return this.budgetRepository.findByUser(userId);
  }

  async getBudgetById(id) {
    return this.budgetRepository.findById(id);
  }

  async updateBudget(id, data) {
    return this.budgetRepository.update(id, data);
  }

  async deleteBudget(id) {
    return this.budgetRepository.delete(id);
  }
}

export default new BudgetService(); 



