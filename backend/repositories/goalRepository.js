
import BaseRepository from './baseRepository.js';
import Goal from '../models/Goal.js';


class GoalRepository extends BaseRepository {
  constructor() {
    super(Goal);
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers(event, data) {
    this.observers.forEach(obs => obs.update(event, data));
  }

  async create(data) {
    const goal = await super.create(data);
    this.notifyObservers('create', goal);
    return goal;
  }

  async update(id, data) {
    const updated = await super.update(id, data);
    this.notifyObservers('update', updated);
    return updated;
  }

  async findByUser(userId) {
    return this.model.find({ userId }).sort({ deadline: 1 });
  }
}

export default new GoalRepository();