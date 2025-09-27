import BaseController from './baseController.js';
import BudgetService from '../services/budgetService.js';

// OOP Principle: Inheritance - BudgetController extends BaseController
class BudgetController extends BaseController {
  constructor() {
    // We'll handle repository in services
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

    switch (req.method) {
      case 'POST':
        return this.budgetService.createBudget({ ...req.body, userId });
      case 'GET':
        // Check if we're getting a specific budget or all budgets
        if (req.params.id) {
          return this.budgetService.getBudgetById(req.params.id, userId);
        }
        return this.budgetService.getBudgetsByUser(userId);
      case 'PUT':
        // Extract budget ID from request parameters
        if (!req.params.id) {
          throw new Error('Budget ID is required for update operations');
        }
        return this.budgetService.updateBudget(req.params.id, req.body, userId);
      case 'DELETE':
        // Extract budget ID from request parameters
        if (!req.params.id) {
          throw new Error('Budget ID is required for delete operations');
        }
        return this.budgetService.deleteBudget(req.params.id, userId);
      default:
        throw new Error('Method not supported');
    }
  }
}

// Using Decorator Pattern to add authentication
const budgetController = new BudgetController();

// Create handlers for specific endpoints
export const createBudget = (req, res) => budgetController.handleRequest(req, res);
export const getBudgets = (req, res) => budgetController.handleRequest(req, res);
export const getBudgetById = (req, res) => budgetController.handleRequest(req, res);
export const updateBudget = (req, res) => budgetController.handleRequest(req, res);
export const deleteBudget = (req, res) => budgetController.handleRequest(req, res);
