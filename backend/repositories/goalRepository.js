import BaseRepository from './baseRepository.js';
import Goal from '../models/Goal.js';

class GoalRepository extends BaseRepository {
  constructor() {
    super(Goal);
  }

  async findByUser(userId) {
    return this.model.find({ userId }).sort({ deadline: 1 }).exec();
  }
}

export default GoalRepository;