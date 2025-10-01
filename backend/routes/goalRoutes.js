const express = require('express');
const { getGoals, getGoalById, addGoal, updateGoal, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Goal:
 *       type: object
 *       required:
 *         - name
 *         - target
 *         - deadline
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the goal
 *         userId:
 *           type: string
 *           description: The ID of the user who owns this goal
 *         name:
 *           type: string
 *           description: The name/title of the goal
 *         target:
 *           type: number
 *           minimum: 0
 *           description: The target amount for the goal
 *         current:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: The current progress amount
 *         deadline:
 *           type: string
 *           format: date
 *           description: The deadline for achieving the goal
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the goal was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the goal was last updated
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         userId: "507f1f77bcf86cd799439012"
 *         name: "Emergency Fund"
 *         target: 5000
 *         current: 1500
 *         deadline: "2024-12-31"
 *         createdAt: "2023-10-01T12:00:00.000Z"
 *         updatedAt: "2023-10-01T12:00:00.000Z"
 *
 *     GoalInput:
 *       type: object
 *       required:
 *         - name
 *         - target
 *         - deadline
 *       properties:
 *         name:
 *           type: string
 *           description: The name/title of the goal
 *         target:
 *           type: number
 *           minimum: 0
 *           description: The target amount for the goal
 *         current:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: The current progress amount
 *         deadline:
 *           type: string
 *           format: date
 *           description: The deadline for achieving the goal (must be in the future)
 *       example:
 *         name: "Emergency Fund"
 *         target: 5000
 *         current: 1500
 *         deadline: "2024-12-31"
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
 *         message: "Goal not found"
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
 * /api/goals:
 *   get:
 *     summary: Get all goals for the logged-in user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Goals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 goals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Goal'
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of goals
 *                       example: 5
 *                     completed:
 *                       type: integer
 *                       description: Number of completed goals
 *                       example: 2
 *                     totalTarget:
 *                       type: number
 *                       description: Sum of all goal targets
 *                       example: 25000
 *                     totalCurrent:
 *                       type: number
 *                       description: Sum of all current progress
 *                       example: 15000
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
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoalInput'
 *     responses:
 *       201:
 *         description: Goal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Goal created successfully"
 *                 goal:
 *                   $ref: '#/components/schemas/Goal'
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
router.route('/')
  .get(getGoals)
  .post(addGoal);

/**
 * @swagger
 * /api/goals/{id}:
 *   get:
 *     summary: Get a specific goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The goal ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Goal retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Goal not found or doesn't belong to user
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
 *   put:
 *     summary: Update a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The goal ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoalInput'
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Goal updated successfully"
 *                 goal:
 *                   $ref: '#/components/schemas/Goal'
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
 *         description: Goal not found or doesn't belong to user
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
 *   delete:
 *     summary: Delete a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The goal ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Goal deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Goal not found or doesn't belong to user
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
router.route('/:id')
  .get(getGoalById)
  .put(updateGoal)
  .delete(deleteGoal);

module.exports = router;
