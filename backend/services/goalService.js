
import GoalRepository from '../repositories/goalRepository.js';


class GoalService {
  constructor() {
    if (GoalService.instance) return GoalService.instance;
    this.goalRepository = new GoalRepository();
    GoalService.instance = this;
  }

  
  async getGoalsByUser(userId) {
    return this.goalRepository.findByUser(userId);
  }

  async getGoalById(id) {
    return this.goalRepository.findById(id);
  }

  async createGoal(data) {
    
    return this.goalRepository.create(data);
  }

  async updateGoal(id, data) {
    return this.goalRepository.update(id, data);
  }

  async deleteGoal(id) {
    return this.goalRepository.delete(id);
  }
}


export default new GoalService();