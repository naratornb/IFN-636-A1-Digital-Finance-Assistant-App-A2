import BaseController from './baseController.js';
import BudgetService from '../services/budgetService.js';

class BudgetController extends BaseController {
  async validateRequest(req) {
    if (['POST', 'PUT'].includes(req.method)) {
      const { period, totalBudget } = req.body;
      if (!period || !totalBudget) throw new Error('Period and totalBudget are required');
    }
  }

  async processRequest(req) {
    const userId = req.user.id;
    const id = req.params.id;

    switch (req.method) {
      case 'POST':
        return BudgetService.createBudget({ ...req.body, userId });
      case 'GET':
        if (id) return BudgetService.getBudgetById(id);
        return BudgetService.getBudgetsByUser(userId);
      case 'PUT':
        if (!id) throw new Error('Budget ID required');
        return BudgetService.updateBudget(id, req.body);
      case 'DELETE':
        if (!id) throw new Error('Budget ID required');
        return BudgetService.deleteBudget(id);
    }
  }
}

const controller = new BudgetController();

export const createBudget = controller.handleRequest.bind(controller);
export const getBudgets = controller.handleRequest.bind(controller);
export const getBudgetById = controller.handleRequest.bind(controller);
export const updateBudget = controller.handleRequest.bind(controller);
export const deleteBudget = controller.handleRequest.bind(controller);