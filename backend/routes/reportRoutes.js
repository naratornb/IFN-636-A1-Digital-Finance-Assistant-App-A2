/*
const express = require('express');
const { getReports, addReport, updateReport, deleteReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getReports).post(protect, addReport);
router.route('/:id').put(protect, updateReport).delete(protect, deleteReport);

module.exports = router;

*/

// reportRoutes.js
import express from 'express';
import { getReports, addReport, updateReport, deleteReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateReport } from '../middleware/validateReport.js';

const router = express.Router();

router.use(protect); // protect all report routes

router.route('/')
  .get(getReports)
  .post(validateReport, addReport);

router.route('/:id')
  .put(validateReport, updateReport)
  .delete(deleteReport);

export default router;