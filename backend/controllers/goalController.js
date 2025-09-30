import BaseController from './baseController.js';
import goalService from '../services/goalService.js'; // Import the instance directly

// OOP Principle: Inheritance - GoalController extends BaseController
class GoalController extends BaseController {
  constructor() {
    super(null);
    this.goalService = goalService;
  }

  async validateRequest(req) {
    if (req.method === 'POST' || req.method === 'PUT') {
      if (!req.body.name || !req.body.target) {
        throw new Error('Name and target are required');
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
        if (id) {
          return this.goalService.getGoalById(id, userId);
        } else {
          return this.goalService.getGoalsByUser(userId);
        }
      case 'PUT':
        if (!req.params.id) {
          throw new Error('Goal ID is required for update operations');
        }
        return this.goalService.updateGoal(req.params.id, req.body, userId);
      case 'DELETE':
        if (!req.params.id) {
          throw new Error('Goal ID is required for delete operations');
        }
        return this.goalService.deleteGoal(req.params.id, userId);
      default:
        throw new Error(`Method ${req.method} not supported`);
    }
  }

  async getGoals(req, res) {
    await this.handleRequest(req, res);
  }

  async getGoalById(req, res) {
    await this.handleRequest(req, res);
  }

  async addGoal(req, res) {
    await this.handleRequest(req, res);
  }

  async updateGoal(req, res) {
    await this.handleRequest(req, res);
  }

  async deleteGoal(req, res) {
    await this.handleRequest(req, res);
  }
}

const controller = new GoalController();
export const getGoals = controller.getGoals.bind(controller);
export const getGoalById = controller.getGoalById.bind(controller);
export const addGoal = controller.addGoal.bind(controller);
export const updateGoal = controller.updateGoal.bind(controller);
export const deleteGoal = controller.deleteGoal.bind(controller);