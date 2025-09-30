/*const express = require('express');
const { getGoals, addGoal, updateGoal, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getGoals)
  .post(protect, addGoal);

router.route('/:id')
  .put(protect, updateGoal)
  .delete(protect, deleteGoal);

module.exports = router;
*/
// goalRoutes.js
import express from 'express';
import GoalController from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, GoalController.getGoals.bind(GoalController))
  .post(protect, GoalController.addGoal.bind(GoalController));

router.route('/:id')
  .put(protect, GoalController.updateGoal.bind(GoalController))
  .delete(protect, GoalController.deleteGoal.bind(GoalController));

export default router;