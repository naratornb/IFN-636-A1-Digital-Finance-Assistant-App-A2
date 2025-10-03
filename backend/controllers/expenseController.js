import BaseController from './baseController.js';
import ExpenseService from '../services/expenseService.js';

class ExpenseController extends BaseController {
  constructor() {
    super(null); 
    this.expenseService = new ExpenseService();
  }

  async validateRequest(req) {
    if (req.method === 'POST' || req.method === 'PUT') {
      const { category, amount, date } = req.body;
      if (!category || !amount || !date) {
        throw new Error('Category, amount, and date are required');
      }
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
    }
  }

  async processRequest(req) {
    const userId = req.user.id;
    const { id } = req.params;

    switch (req.method) {
      case 'POST':
        return this.expenseService.createExpense({ ...req.body, userId });
      case 'GET':
        if (id) {
          return this.expenseService.getExpenseById(id);
        } else {
          const { startDate, endDate } = req.query;
          if (startDate && endDate) {
            return this.expenseService.getExpensesByUserAndDateRange(
              userId,
              new Date(startDate),
              new Date(endDate)
            );
          } else {
            return this.expenseService.getExpensesByUser(userId);
          }
        }
      case 'PUT':
        return this.expenseService.updateExpense(id, req.body);
      case 'DELETE':
        return this.expenseService.deleteExpense(id);
      default:
        throw new Error('Method not supported');
    }
  }
}

const expenseController = new ExpenseController();

export const createExpense =expenseController.handleRequest;
export const getExpenses = expenseController.handleRequest;
export const getExpenseById = expenseController.handleRequest;
export const updateExpense = expenseController.handleRequest;
export const deleteExpense = expenseController.handleRequest;
