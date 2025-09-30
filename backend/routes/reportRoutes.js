const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// GET dashboard data
router.get('/', reportController.getDashboardData.bind(reportController));

// Generate and download PDF report with automatic download logging
router.get('/pdf', reportController.generatePdf.bind(reportController));

// Get report download logs for the current user
router.get('/download-logs', reportController.getDownloadLogs.bind(reportController));

// Clear all report download logs for the current user
router.delete('/download-logs', reportController.clearDownloadLogs.bind(reportController));

module.exports = router;
