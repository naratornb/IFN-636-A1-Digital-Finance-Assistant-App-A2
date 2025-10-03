import BaseController from './baseController.js';
import BudgetService from '../services/budgetService.js';

class BudgetController extends BaseController {
  constructor() {
    super(null);
    this.budgetService = new BudgetService();
  }

  async validateRequest(req) {
    if (req.method === 'POST') {
      if (!req.body.period || !req.body.totalBudget) {
        throw new Error('Period and total budget are required');
      }
    }
  }

  async processRequest(req) {
    const userId = req.user.id;
    const id = req.params.id;

    switch (req.method) {
      case 'POST':
        return this.budgetService.createBudget({ ...req.body, userId });
      case 'GET':
          if (id) {
            return this.budgetService.getBudgetById(id, userId);
          } else {
            return this.budgetService.getBudgetsByUser(userId);
          }
      case 'PUT':
        if (!req.params.id) {
          throw new Error('Budget ID is required for update operations');
        }
        return this.budgetService.updateBudget(req.params.id, req.body, userId);
      case 'DELETE':
        if (!req.params.id) {
          throw new Error('Budget ID is required for delete operations');
        }
        return this.budgetService.deleteBudget(req.params.id, userId);
      default:
        throw new Error('Method not supported');
    }
  }
}

const budgetController = new BudgetController();
export const createBudget = budgetController.handleRequest;
export const getBudgets = budgetController.handleRequest;
export const getBudgetById = budgetController.handleRequest;
export const updateBudget = budgetController.handleRequest;
export const deleteBudget = budgetController.handleRequest;

