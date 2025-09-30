const express = require('express');
const { getGoals, getGoalById, addGoal, updateGoal, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getGoals)
  .post(addGoal);

router.route('/:id')
  .get(getGoalById)
  .put(updateGoal)
  .delete(deleteGoal);

module.exports = router;
