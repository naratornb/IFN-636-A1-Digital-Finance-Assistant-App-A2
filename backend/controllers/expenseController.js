/*
const Expense = require('../models/Expense');

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addExpense = async (req, res) => {
  const { name, amount, deadline, paymentMethod, description } = req.body;
  try {
    const expense = await Expense.create({
      userId: req.user.id,
      name,
      amount,
      deadline,
      paymentMethod,
      description
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  const { name, amount, deadline, paymentMethod, description } = req.body;
  try {
    const expense = await Expense.findById(req.params.id); 
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    expense.name = name || expense.name;
    expense.amount = amount || expense.amount;
    expense.deadline = deadline || expense.deadline;
    expense.paymentMethod = paymentMethod || expense.paymentMethod;
    expense.description = description || expense.description;

    const updatedExpense = await expense.save(); 
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    await expense.remove();
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense };
*/
// expenseController.js
import Expense from '../models/Expense.js';

class ExpenseController {
  async getExpenses(req, res) {
    try {
      const expenses = await Expense.find({ userId: req.user.id });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addExpense(req, res) {
    const { name, amount, deadline, paymentMethod, description } = req.body;
    try {
      const expense = await Expense.create({
        userId: req.user.id,
        name,
        amount,
        deadline,
        paymentMethod,
        description
      });
      res.status(201).json(expense);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateExpense(req, res) {
    const { name, amount, deadline, paymentMethod, description } = req.body;
    try {
      const expense = await Expense.findById(req.params.id);
      if (!expense) return res.status(404).json({ message: 'Expense not found' });

      expense.name = name || expense.name;
      expense.amount = amount || expense.amount;
      expense.deadline = deadline || expense.deadline;
      expense.paymentMethod = paymentMethod || expense.paymentMethod;
      expense.description = description || expense.description;

      const updatedExpense = await expense.save();
      res.json(updatedExpense);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteExpense(req, res) {
    try {
      const expense = await Expense.findById(req.params.id);
      if (!expense) return res.status(404).json({ message: 'Expense not found' });

      await expense.remove();
      res.json({ message: 'Expense deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new ExpenseController();