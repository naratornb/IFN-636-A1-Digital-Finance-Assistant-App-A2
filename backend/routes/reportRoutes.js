const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// GET dashboard data
router.get('/', protect, reportController.getDashboardData.bind(reportController));

module.exports = router;
router.route('/pdf').get(protect, reportController.generatePdf);

module.exports = router;
