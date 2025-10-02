import BaseRepository from './baseRepository.js';
import Expense from '../models/Expense.js';

class ExpenseRepository extends BaseRepository {
  constructor() {
    super(Expense);
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers(event, data) {
    this.observers.forEach(obs => obs.update(event, data));
  }

  async create(data) {
    const expense = await super.create(data);
    this.notifyObservers('create', expense);
    return expense;
  }

  async update(id, data) {
    const updated = await super.update(id, data);
    this.notifyObservers('update', updated);
    return updated;
  }

  async findByUser(userId) {
    return this.model.find({ userId }).sort({ date: -1 });
  }

  async findByUserAndDateRange(userId, startDate, endDate) {
    return this.model.find({ userId, date: { $gte: startDate, $lte: endDate } }).sort({ date: -1 });
  }

  async findByBudget(budgetId) {
    return this.model.find({ budgetId });
  }
}

export default new ExpenseRepository();