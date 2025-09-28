// repositories/goalRepository.js
import BaseRepository from './baseRepository.js';
import Goal from '../models/Goal.js';

class GoalRepository extends BaseRepository {
  constructor() {
    super(Goal);
  }

  // Additional Goal-specific methods if needed
  async findByUser(userId) {
    return this.model.find({ userId }).sort({ deadline: 1 }).exec();
  }
}

export default GoalRepository;