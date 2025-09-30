/* const Goal = require('../models/Goal');

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addGoal = async (req, res) => {
  const { name, amount, deadline } = req.body;
  try {
    const goal = await Goal.create({ userId: req.user.id, name, amount, deadline });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGoal = async (req, res) => {
  const { name, amount, deadline } = req.body;
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal.name = name || goal.name;
    goal.amount = amount || goal.amount;
    goal.deadline = deadline || goal.deadline;

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    await goal.remove();
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGoals, addGoal, updateGoal, deleteGoal };

*/
// GoalController.js
import Goal from '../models/Goal.js';

class GoalController {
  // Get all goals for user
  async getGoals(req, res) {
    try {
      const goals = await Goal.find({ userId: req.user.id });
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Add new goal
  async addGoal(req, res) {
    const { name, amount, deadline } = req.body;
    try {
      const goal = await Goal.create({ userId: req.user.id, name, amount, deadline });
      res.status(201).json(goal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update goal
  async updateGoal(req, res) {
    const { name, amount, deadline } = req.body;
    try {
      const goal = await Goal.findById(req.params.id);
      if (!goal) return res.status(404).json({ message: 'Goal not found' });

      goal.name = name || goal.name;
      goal.amount = amount || goal.amount;
      goal.deadline = deadline || goal.deadline;

      const updatedGoal = await goal.save();
      res.json(updatedGoal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete goal
  async deleteGoal(req, res) {
    try {
      const goal = await Goal.findById(req.params.id);
      if (!goal) return res.status(404).json({ message: 'Goal not found' });
      
      await goal.remove();
      res.json({ message: 'Goal deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new GoalController();