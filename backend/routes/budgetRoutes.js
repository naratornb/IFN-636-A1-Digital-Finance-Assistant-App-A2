const express = require('express');
const { getBudgets,getBudgetById, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(createBudget);

router.route('/:id')
  .get(getBudgetById)
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;
