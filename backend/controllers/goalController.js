
import BaseController from './baseController.js';
import goalService from '../services/goalService.js';


class GoalController extends BaseController {
  constructor() {
    super(null);
    this.goalService = goalService;
  }

  
  async validateRequest(req) {
    if (req.method === 'POST' || req.method === 'PUT') {
      if (!req.body.name || req.body.target == null) {
        throw new Error('Name and target are required');
      }
      if (req.body.target < 0) {
        throw new Error('Target cannot be negative');
      }
    }
  }

  
  async processRequest(req) {
    const userId = req.user.id;
    const id = req.params.id;

    switch (req.method) {
      case 'POST':
        return this.goalService.createGoal({ ...req.body, userId });
      case 'GET':
        return id
          ? this.goalService.getGoalById(id)
          : this.goalService.getGoalsByUser(userId);
      case 'PUT':
        if (!id) throw new Error('Goal ID required for update');
        return this.goalService.updateGoal(id, req.body);
      case 'DELETE':
        if (!id) throw new Error('Goal ID required for delete');
        return this.goalService.deleteGoal(id);
      default:
        throw new Error(`Unsupported method ${req.method}`);
    }
  }
}


const controller = new GoalController();
export const getGoals = controller.getGoals.bind(controller);
export const getGoalById = controller.getGoalById.bind(controller);
export const addGoal = controller.addGoal.bind(controller);
export const updateGoal = controller.updateGoal.bind(controller);
export const deleteGoal = controller.deleteGoal.bind(controller);