import BaseRepository from './baseRepository.js';
import Budget from '../models/Budget.js';

class BudgetRepository extends BaseRepository {
  constructor() {
    super(Budget);
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notify(event, data) {
    this.observers.forEach(obs => obs.update(event, data));
  }

  async create(data) {
    const result = await super.create(data);
    this.notify('created', result);
    return result;
  }

  async update(id, data) {
    const result = await super.update(id, data);
    this.notify('updated', result);
    return result;
  }

  findByUser(userId) {
    return this.model.find({ userId }).sort({ createdAt: -1 });
  }
}

export default new BudgetRepository();