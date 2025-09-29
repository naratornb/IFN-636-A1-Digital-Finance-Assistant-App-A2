import Budget from '../models/Budget.js';
import BudgetRepository from '../repositories/budgetRepository.js';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addMonths,
  subDays
} from 'date-fns';

// OOP Principle: Abstraction Single Responsibility - Service handles only budget-related logic
// abstracts away the complexity of budget creation, including validation, date calculations, and repository operations. Clients of this services only need to provide basic budget data without worrying about implementation details
class BudgetService {
  constructor() {
    this.budgetRepository = new BudgetRepository(Budget);
  }


  async createBudget(budgetData) {
    const { userId, period, totalBudget, notes, startDate: userStartDate } = budgetData;

    let startDate, endDate;
    const dateToUse = userStartDate ? new Date(userStartDate) : new Date();

    if (period === 'weekly') {
      startDate = userStartDate ? dateToUse : startOfWeek(dateToUse, { weekStartsOn: 1 });

      endDate = addDays(new Date(startDate), 6);

      endDate.setHours(23, 59, 59, 999);
    } else { // monthly
      startDate = userStartDate ? dateToUse : startOfMonth(dateToUse);

      const nextMonth = addMonths(new Date(startDate), 1);
      endDate = subDays(nextMonth, 1);

      endDate.setHours(23, 59, 59, 999);
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