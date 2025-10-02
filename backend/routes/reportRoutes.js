const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware'); // optional

// Decorator Pattern: Middleware applied to routes
router.post('/generate', authMiddleware, reportController.generateReport);
router.get('/logs', authMiddleware, reportController.getReportLogs);
router.delete('/logs', authMiddleware, reportController.clearReportLogs);

module.exports = router;