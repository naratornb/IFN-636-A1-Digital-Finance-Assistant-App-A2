// services/goalService.js
import GoalRepository from '../repositories/goalRepository.js';

class GoalService {
  constructor() {
    this.goalRepository = new GoalRepository();
  }

  async getGoalsByUser(userId) {
    return this.goalRepository.findByUser(userId);
  }

  async createGoal(data) {
    return this.goalRepository.create(data);
  }

  async getGoalById(id) {
    return this.goalRepository.findById(id);
  }

  async updateGoal(id, data) {
    return this.goalRepository.update(id, data);
  }

  async deleteGoal(id) {
    return this.goalRepository.delete(id);
  }
}

export default new GoalService();