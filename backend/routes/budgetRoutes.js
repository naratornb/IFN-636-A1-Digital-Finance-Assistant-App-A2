import express from 'express';
import { getBudgets, getBudgetById, createBudget, updateBudget, deleteBudget } from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateBudgetData } from '../middleware/validateBudget.js';

const router = express.Router();

// All routes protected by authentication
router.use(protect);

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     description: Get all user budgets
 *     ...
 */
router.route('/')
  .get(getBudgets)
  .post(validateBudgetData, createBudget); // validate input on POST

/**
 * @swagger
 * /api/budgets/{id}:
 *   get:
 *     description: Get budget by ID
 *     ...
 *   put:
 *     description: Update a budget
 *     ...
 *   delete:
 *     description: Delete a budget
 *     ...
 */
router.route('/:id')
  .get(getBudgetById)
  .put(validateBudgetData, updateBudget) // validate on PUT
  .delete(deleteBudget);

export default router;