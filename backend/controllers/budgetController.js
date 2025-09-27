/*
const Budget = require('../models/Budget');

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addBudget = async (req, res) => {
  const { name, saved, amount, deadline, status, description } = req.body;
  try {
    const budget = await Budget.create({ userId: req.user.id, name, saved, amount, deadline, status, description });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBudget = async (req, res) => {
  const { name, saved, amount, deadline, status, description } = req.body;
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    budget.name = name || budget.name;
    budget.saved = saved || budget.saved;
    budget.amount = amount || budget.amount;
    budget.deadline = deadline || budget.deadline;
    budget.status = status || budget.status;
    budget.description = description || budget.description;

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    await budget.remove();
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBudgets, addBudget, updateBudget, deleteBudget };


// src/controllers/BudgetController.js
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
          return this.budgetService.getBudgetsByUser(userId);
      case 'PUT':
        return this.budgetService.updateBudget(id, req.body);
      case 'DELETE':
        return this.budgetService.deleteBudget(id);
      default:
        throw new Error('Method not supported');
    }
  }
}

// Using Decorator Pattern to add authentication
const budgetController = new BudgetController();
export const createBudget = budgetController.handleRequest;
export const getBudgets = budgetController.handleRequest;
export const getBudgetById = budgetController.handleRequest;
export const updateBudget = budgetController.handleRequest;
export const deleteBudget = budgetController.handleRequest;
*/

import BaseController from './baseController.js';
import BudgetService from '../services/budgetService.js';

class BudgetController extends BaseController {
  constructor() {
    super(null);
    this.budgetService = new BudgetService();
  }

  async processRequest(req) {
    const userId = req.user.id;

    if (req.method === 'POST') {
      // create a new budget
      return this.budgetService.createBudget({ ...req.body, userId });
    } else if (req.method === 'GET') {
      // get all budgets for user
      return this.budgetService.getBudgetsByUser(userId);
    } else if (req.method === 'PUT') {
      const { id } = req.params; // get id from route params
      return this.budgetService.updateBudget(id, { ...req.body });
    } else if (req.method === 'DELETE') {
      const { id } = req.params;
      return this.budgetService.deleteBudget(id);
    } else {
      throw new Error('Method not supported');
    }
  }
}

export default new BudgetController();