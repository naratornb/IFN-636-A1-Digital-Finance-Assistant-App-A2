const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const {createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense} = require("../controllers/expenseController");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       required:
 *         - category
 *         - amount
 *         - date
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the expense
 *         userId:
 *           type: string
 *           description: The ID of the user who owns this expense
 *         budgetId:
 *           type: string
 *           description: The ID of the associated budget (optional)
 *         category:
 *           type: string
 *           enum: [Housing, Transportation, Food, Utilities, Healthcare, Insurance, Debt, Entertainment, Personal, Savings, Other]
 *           description: The expense category
 *         amount:
 *           type: number
 *           minimum: 0
 *           description: The expense amount
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the expense
 *         description:
 *           type: string
 *           description: Optional description of the expense
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the expense was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the expense was last updated
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         userId: "507f1f77bcf86cd799439012"
 *         budgetId: "507f1f77bcf86cd799439013"
 *         category: "Food"
 *         amount: 25.50
 *         date: "2023-10-01"
 *         description: "Lunch at restaurant"
 *         createdAt: "2023-10-01T12:00:00.000Z"
 *         updatedAt: "2023-10-01T12:00:00.000Z"
 *
 *     ExpenseInput:
 *       type: object
 *       required:
 *         - category
 *         - amount
 *         - date
 *       properties:
 *         budgetId:
 *           type: string
 *           description: The ID of the associated budget (optional)
 *         category:
 *           type: string
 *           enum: [Housing, Transportation, Food, Utilities, Healthcare, Insurance, Debt, Entertainment, Personal, Savings, Other]
 *           description: The expense category
 *         amount:
 *           type: number
 *           minimum: 0
 *           description: The expense amount
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the expense
 *         description:
 *           type: string
 *           description: Optional description of the expense
 *       example:
 *         budgetId: "507f1f77bcf86cd799439013"
 *         category: "Food"
 *         amount: 25.50
 *         date: "2023-10-01"
 *         description: "Lunch at restaurant"
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         error:
 *           type: string
 *           description: Error details
 *       example:
 *         message: "Expense not found"
 *         error: "Not Found"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseInput'
 *     responses:
 *       201:
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expense created successfully"
 *                 expense:
 *                   $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createExpense);

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses for the logged-in user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering expenses (YYYY-MM-DD)
 *         example: "2023-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering expenses (YYYY-MM-DD)
 *         example: "2023-12-31"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Housing, Transportation, Food, Utilities, Healthcare, Insurance, Debt, Entertainment, Personal, Savings, Other]
 *         description: Filter by expense category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of expenses per page
 *     responses:
 *       200:
 *         description: Expenses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expenses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expense'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pages:
 *                       type: integer
 *                       example: 5
 *                     total:
 *                       type: integer
 *                       example: 50
 *                 totalAmount:
 *                   type: number
 *                   description: Sum of all expenses in the filtered results
 *                   example: 1250.75
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getExpenses);

/**
 * @swagger
 * /api/expenses/{id}:
 *   get:
 *     summary: Get a specific expense by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The expense ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Expense retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Expense not found or doesn't belong to user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getExpenseById);

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The expense ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseInput'
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expense updated successfully"
 *                 expense:
 *                   $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Expense not found or doesn't belong to user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updateExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The expense ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expense deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Expense not found or doesn't belong to user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteExpense);

module.exports = router;
