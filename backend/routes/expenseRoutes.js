const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const {createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense} = require("../controllers/expenseController");
const router = express.Router();

// All routes require authentication
router.use(protect);

// POST /api/expenses - Create a new expense
router.post('/', createExpense);

// GET /api/expenses - Get all expenses for the logged-in user
// Optionally with date range: /api/expenses?startDate=2023-01-01&endDate=2023-12-31
router.get('/', getExpenses);

// GET /api/expenses/:id - Get a specific expense by ID
router.get('/:id', getExpenseById);

// PUT /api/expenses/:id - Update an expense
router.put('/:id', updateExpense);

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', deleteExpense);

module.exports = router;
