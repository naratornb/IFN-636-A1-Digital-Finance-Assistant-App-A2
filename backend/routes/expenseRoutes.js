/*
const express = require('express');
const { getExpenses, addExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getExpenses)
  .post(protect, addExpense);

router.route('/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

module.exports = router;
*/

// expenseRoutes.js
import express from 'express';
import ExpenseController from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Optionally, apply protect globally
router.use(protect);

router.route('/')
  .get(ExpenseController.getExpenses.bind(ExpenseController))
  .post(ExpenseController.addExpense.bind(ExpenseController));

router.route('/:id')
  .put(ExpenseController.updateExpense.bind(ExpenseController))
  .delete(ExpenseController.deleteExpense.bind(ExpenseController));

export default router;