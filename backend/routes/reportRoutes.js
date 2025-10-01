const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);
/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardData:
 *       type: object
 *       properties:
 *         totalExpenses:
 *           type: number
 *           description: Total expenses amount
 *           example: 2500.75
 *         totalBudgets:
 *           type: number
 *           description: Total budget amount
 *           example: 5000.00
 *         totalGoals:
 *           type: number
 *           description: Total goals target amount
 *           example: 10000.00
 *         expensesByCategory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "Food"
 *               amount:
 *                 type: number
 *                 example: 450.25
 *               percentage:
 *                 type: number
 *                 example: 18.01
 *         monthlyExpenses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               month:
 *                 type: string
 *                 example: "2023-10"
 *               amount:
 *                 type: number
 *                 example: 750.00
 *         budgetUtilization:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               budgetName:
 *                 type: string
 *                 example: "Monthly Groceries"
 *               allocated:
 *                 type: number
 *                 example: 500.00
 *               spent:
 *                 type: number
 *                 example: 325.50
 *               percentage:
 *                 type: number
 *                 example: 65.1
 *         goalProgress:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               goalName:
 *                 type: string
 *                 example: "Emergency Fund"
 *               target:
 *                 type: number
 *                 example: 5000.00
 *               current:
 *                 type: number
 *                 example: 1500.00
 *               percentage:
 *                 type: number
 *                 example: 30.0
 *
 *     ReportDownload:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the download log
 *         userId:
 *           type: string
 *           description: The ID of the user who downloaded the report
 *         dateRange:
 *           type: object
 *           properties:
 *             startDate:
 *               type: string
 *               format: date
 *               description: Start date of the report range
 *             endDate:
 *               type: string
 *               format: date
 *               description: End date of the report range
 *         fileName:
 *           type: string
 *           description: Name of the downloaded file
 *         downloadTime:
 *           type: string
 *           format: date-time
 *           description: When the report was downloaded
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the log was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the log was last updated
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         userId: "507f1f77bcf86cd799439012"
 *         dateRange:
 *           startDate: "2023-01-01"
 *           endDate: "2023-12-31"
 *         fileName: "financial_report_2023.pdf"
 *         downloadTime: "2023-10-01T12:00:00.000Z"
 *         createdAt: "2023-10-01T12:00:00.000Z"
 *         updatedAt: "2023-10-01T12:00:00.000Z"
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
 *         message: "Report generation failed"
 *         error: "Internal Server Error"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get dashboard data with financial overview
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering data (YYYY-MM-DD)
 *         example: "2023-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering data (YYYY-MM-DD)
 *         example: "2023-12-31"
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardData'
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
router.get('/', reportController.getDashboardData.bind(reportController));

/**
 * @swagger
 * /api/reports/pdf:
 *   get:
 *     summary: Generate and download PDF report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report data (YYYY-MM-DD)
 *         example: "2023-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report data (YYYY-MM-DD)
 *         example: "2023-12-31"
 *       - in: query
 *         name: includeCharts
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Include charts and graphs in the PDF
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [summary, detailed]
 *           default: detailed
 *         description: Report format type
 *     responses:
 *       200:
 *         description: PDF report generated and downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: "attachment; filename=financial_report_2023.pdf"
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: "application/pdf"
 *       400:
 *         description: Bad request - Invalid date range or parameters
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
 *         description: Internal server error - PDF generation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/pdf', reportController.generatePdf.bind(reportController));

/**
 * @swagger
 * /api/reports/download-logs:
 *   get:
 *     summary: Get report download logs for the current user
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Number of logs per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [downloadTime, fileName]
 *           default: downloadTime
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Download logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReportDownload'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pages:
 *                       type: integer
 *                       example: 3
 *                     total:
 *                       type: integer
 *                       example: 25
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalDownloads:
 *                       type: integer
 *                       description: Total number of downloads
 *                       example: 25
 *                     lastDownload:
 *                       type: string
 *                       format: date-time
 *                       description: Most recent download time
 *                       example: "2023-10-01T12:00:00.000Z"
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
 *   delete:
 *     summary: Clear all report download logs for the current user
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Download logs cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Download logs cleared successfully"
 *                 deletedCount:
 *                   type: integer
 *                   description: Number of logs deleted
 *                   example: 25
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
router.get('/download-logs', reportController.getDownloadLogs.bind(reportController));

// Clear all report download logs for the current user
router.delete('/download-logs', reportController.clearDownloadLogs.bind(reportController));

module.exports = router;
