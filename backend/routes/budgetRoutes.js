const express = require('express');
const { getBudgets,getBudgetById, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Budget management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Budget:
 *       type: object
 *       required:
 *         - name
 *         - amount
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated budget ID
 *         name:
 *           type: string
 *           description: Budget name
 *         amount:
 *           type: number
 *           description: Budget amount
 *         period:
 *           type: string
 *           enum: [monthly, weekly, yearly]
 *           default: monthly
 *         user:
 *           type: string
 *           description: Reference to user ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Get all user budgets
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user budgets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Budget'
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Create a new budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               period:
 *                 type: string
 *                 enum: [monthly, weekly, yearly]
 *                 default: monthly
 *     responses:
 *       201:
 *         description: Created budget
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 */
router.route('/')
  .get(getBudgets)
  .post(createBudget);

/**
 * @swagger
 * /api/budgets/{id}:
 *   get:
 *     summary: Get budget by ID
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Budget ID
 *     responses:
 *       200:
 *         description: Budget details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Budget'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Budget not found
 *   put:
 *     summary: Update a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Budget ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               period:
 *                 type: string
 *                 enum: [monthly, weekly, yearly]
 *     responses:
 *       200:
 *         description: Updated budget
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Budget not found
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Budget ID
 *     responses:
 *       200:
 *         description: Budget deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Budget not found
 */
router.route('/:id')
  .get(getBudgetById)
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;
