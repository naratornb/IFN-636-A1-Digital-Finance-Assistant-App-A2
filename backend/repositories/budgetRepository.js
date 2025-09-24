import BaseRepository from './BaseRepository.js';
import Budget from '../models/Budget.js';

class BudgetRepository extends BaseRepository {
  constructor() {
    super(Budget);
  }

  // Additional methods specific to Budget
  async findByUserAndPeriod(userId, period) {
    return this.model.findOne({ userId, period });
  }

  async findByUser(userId) {
    return this.model.find({ userId }).sort({ createdAt: -1 });
  }
}

export default BudgetRepository;