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

