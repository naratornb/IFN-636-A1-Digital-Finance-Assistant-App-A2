const BaseController = require('./baseController');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const reportService = require('../services/reportService');
const { ReportDownload } = require('../models/Report');

class ReportController extends BaseController {
  constructor() {
    super(null); 
  }

  /**
   * @param {Object} res 
   * @param {Object} data 
   * @param {String} message 
   * @param {Number} statusCode 
   */
  sendSuccess(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * @param {Object} res 
   * @param {String} message 
   * @param {Number} statusCode 
   */
  sendError(res, message = 'Server error', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message
    });
  }

  /**
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   */
  async getDashboardData(req, res) {
    try {
      // Check for startDate and endDate query parameters
      let startDate, endDate;

      if (req.query.startDate && req.query.endDate) {
        // Use the provided date range from query parameters
        startDate = new Date(req.query.startDate);
        endDate = new Date(req.query.endDate);

        // Set the end date to the end of the day
        endDate.setHours(23, 59, 59, 999);
      } else {
        // Default to last 365 days if no dates provided
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 365);
      }

      // Get user ID from request
      const userId = req.user._id;

      // Fetch expenses - using userId and date range
      const expenses = await Expense.find({
        userId: userId,
        date: { $gte: startDate, $lte: endDate }
      });

      // Fetch budgets that overlap with the selected date range
      // A budget is relevant if:
      // 1. It starts before the end date AND
      // 2. Either it has no end date OR its end date is after the start date
      const budgets = await Budget.find({
        userId: userId,
        startDate: { $lte: endDate },
        $or: [
          { endDate: null },
          { endDate: { $gte: startDate } }
        ]
      });

      // Calculate total expenses
      const totalExpenses = expenses.length > 0
        ? expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
        : 0;

      // Calculate total budget - adjusted to prorate budgets for the selected period
      let totalBudget = 0;
      if (budgets.length > 0) {
        for (const budget of budgets) {
          // Convert budget to daily rate and multiply to get total for the period
          const budgetAmount = parseFloat(budget.totalBudget) || 0;

          // Determine the period this budget covers within our date range
          const budgetStart = budget.startDate ? new Date(Math.max(budget.startDate, startDate)) : new Date(startDate);
          const budgetEnd = budget.endDate ? new Date(Math.min(budget.endDate, endDate)) : new Date(endDate);

          // Calculate days between dates
          const daysInPeriod = Math.ceil((budgetEnd - budgetStart) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

          // Get budget duration in days
          const budgetStartDate = budget.startDate ? new Date(budget.startDate) : new Date(startDate);
          const budgetEndDate = budget.endDate ? new Date(budget.endDate) : new Date(endDate);
          const totalBudgetDays = Math.ceil((budgetEndDate - budgetStartDate) / (1000 * 60 * 60 * 24)) + 1;

          // Calculate the prorated budget amount for this period
          const proratedBudget = totalBudgetDays > 0 ? (budgetAmount / totalBudgetDays) * daysInPeriod : 0;

          totalBudget += proratedBudget;
        }
      }

      // Calculate remaining budget
      const remainingBudget = totalBudget - totalExpenses;

      // Calculate expense trend (for the selected period, divided into 6 segments)
      const expenseTrend = [];
      const dateDiff = endDate.getTime() - startDate.getTime();
      const segmentDuration = dateDiff / 6; // Divide the date range into 6 equal segments

      for (let i = 0; i < 6; i++) {
        const segmentStart = new Date(startDate.getTime() + (segmentDuration * i));
        const segmentEnd = new Date(startDate.getTime() + (segmentDuration * (i + 1)));

        // Format the segment label based on duration
        let segmentLabel;
        if (dateDiff <= 7 * 24 * 60 * 60 * 1000) { // Less than a week
          segmentLabel = segmentStart.toLocaleDateString('default', { day: 'numeric' });
        } else if (dateDiff <= 60 * 24 * 60 * 60 * 1000) { // Less than 2 months
          segmentLabel = segmentStart.toLocaleDateString('default', { month: 'short', day: 'numeric' });
        } else {
          segmentLabel = segmentStart.toLocaleDateString('default', { month: 'short', year: 'numeric' });
        }

        const segmentExpenses = expenses.filter(expense => {
          const expenseDate = expense.date ? new Date(expense.date) : null;
          if (!expenseDate) return false;

          return expenseDate >= segmentStart && expenseDate < segmentEnd;
        });

        const segmentTotal = segmentExpenses.length > 0
          ? segmentExpenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
          : 0;

        expenseTrend.push({
          name: segmentLabel,
          amount: segmentTotal
        });
      }

      // Calculate budget comparison (for the selected period, divided into 6 segments)
      const budgetComparison = [];

      for (let i = 0; i < 6; i++) {
        const segmentStart = new Date(startDate.getTime() + (segmentDuration * i));
        const segmentEnd = new Date(startDate.getTime() + (segmentDuration * (i + 1)));

        // Format the segment label based on duration
        let segmentLabel;
        if (dateDiff <= 7 * 24 * 60 * 60 * 1000) { // Less than a week
          segmentLabel = segmentStart.toLocaleDateString('default', { day: 'numeric' });
        } else if (dateDiff <= 60 * 24 * 60 * 60 * 1000) { // Less than 2 months
          segmentLabel = segmentStart.toLocaleDateString('default', { month: 'short', day: 'numeric' });
        } else {
          segmentLabel = segmentStart.toLocaleDateString('default', { month: 'short', year: 'numeric' });
        }

        const segmentExpenses = expenses.filter(expense => {
          const expenseDate = expense.date ? new Date(expense.date) : null;
          if (!expenseDate) return false;

          return expenseDate >= segmentStart && expenseDate < segmentEnd;
        });

        const segmentExpenseTotal = segmentExpenses.length > 0
          ? segmentExpenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
          : 0;

        // For budget, we'll find any budget that overlaps with this segment
        const relevantBudgets = budgets.filter(budget => {
          const budgetStart = budget.startDate ? new Date(budget.startDate) : null;
          const budgetEnd = budget.endDate ? new Date(budget.endDate) : null;

          if (!budgetStart) return false;

          // If budget has no end date or the end date is after segment start and start date is before segment end
          return (!budgetEnd || budgetEnd >= segmentStart) && budgetStart <= segmentEnd;
        });

        const segmentBudgetTotal = relevantBudgets.length > 0
          ? relevantBudgets.reduce((sum, budget) => sum + (parseFloat(budget.totalBudget) || 0), 0) / relevantBudgets.length
          : 0;

        budgetComparison.push({
          name: segmentLabel,
          expenses: segmentExpenseTotal,
          budget: segmentBudgetTotal
        });
      }

      // Process top categories
      const categoryMap = {};
      expenses.forEach(expense => {
        const category = expense.category || 'Other';
        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }
        categoryMap[category] += parseFloat(expense.amount) || 0;
      });

      const topCategories = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

      // Process recent transactions
      const recentTransactions = expenses
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date) : new Date(0);
          const dateB = b.date ? new Date(b.date) : new Date(0);
          return dateB - dateA;
        })
        .slice(0, 5);

      // Calculate percentages for pie chart
      const spentPercentage = totalBudget > 0
        ? (totalExpenses / totalBudget) * 100
        : 0;
      const remainingPercentage = 100 - spentPercentage;

      // Create response object
      const dashboardData = {
        totalExpenses,
        totalBudget,
        remainingBudget,
        expenseTrend,
        budgetComparison,
        topCategories,
        recentTransactions,
        spentPercentage,
        remainingPercentage
      };

      return this.sendSuccess(res, dashboardData, 'Dashboard data retrieved successfully');
    } catch (error) {
      console.error('Dashboard error:', error);
      return this.sendError(res, error.message);
    }
  }

  /**
   * Get report download logs for the current user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   */
  async getDownloadLogs(req, res) {
    try {
      const userId = req.user._id;

      // Parse pagination parameters
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'downloadTime';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

      // Get report download logs
      const logs = await reportService.getReportDownloadLogs(userId, {
        limit,
        skip,
        sortBy,
        sortOrder
      });

      // Get total count for pagination
      const total = await ReportDownload.countDocuments({ userId });

      return this.sendSuccess(res, {
        logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }, 'Report download logs retrieved successfully');
    } catch (error) {
      console.error('Error retrieving report download logs:', error);
      return this.sendError(res, error.message);
    }
  }

  /**
   * Clear all report download logs for the current user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   */
  async clearDownloadLogs(req, res) {
    try {
      const userId = req.user._id;

      // Clear report download logs
      const result = await reportService.clearReportDownloadLogs(userId);

      return this.sendSuccess(res, result, `Successfully cleared ${result.deleted} download logs`);
    } catch (error) {
      console.error('Error clearing report download logs:', error);
      return this.sendError(res, error.message);
    }
  }

  /**
   * Generate and download a PDF report
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<void>}
   */
  async generatePdf(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return this.sendError(res, 'Start date and end date are required', 400);
      }

      // Get user ID from request
      const userId = req.user._id;

      // Set up date objects for filtering
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      // Set the end date to the end of the day
      endDateObj.setHours(23, 59, 59, 999);

      // Fetch expenses directly instead of calling getDashboardData
      const expenses = await Expense.find({
        userId: userId,
        date: { $gte: startDateObj, $lte: endDateObj }
      });

      // Fetch budgets that overlap with the selected date range
      const budgets = await Budget.find({
        userId: userId,
        startDate: { $lte: endDateObj },
        $or: [
          { endDate: null },
          { endDate: { $gte: startDateObj } }
        ]
      });

      // Calculate total expenses
      const totalExpenses = expenses.length > 0
        ? expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
        : 0;

      // Calculate total budget
      let totalBudget = 0;
      if (budgets.length > 0) {
        for (const budget of budgets) {
          const budgetAmount = parseFloat(budget.totalBudget) || 0;

          // Determine the period this budget covers within our date range
          const budgetStart = budget.startDate ? new Date(Math.max(budget.startDate, startDateObj)) : new Date(startDateObj);
          const budgetEnd = budget.endDate ? new Date(Math.min(budget.endDate, endDateObj)) : new Date(endDateObj);

          // Calculate days between dates
          const daysInPeriod = Math.ceil((budgetEnd - budgetStart) / (1000 * 60 * 60 * 24)) + 1;

          // Get budget duration in days
          const budgetStartDate = budget.startDate ? new Date(budget.startDate) : new Date(startDateObj);
          const budgetEndDate = budget.endDate ? new Date(budget.endDate) : new Date(endDateObj);
          const totalBudgetDays = Math.ceil((budgetEndDate - budgetStartDate) / (1000 * 60 * 60 * 24)) + 1;

          // Calculate the prorated budget amount for this period
          const proratedBudget = totalBudgetDays > 0 ? (budgetAmount / totalBudgetDays) * daysInPeriod : 0;

          totalBudget += proratedBudget;
        }
      }

      // Calculate remaining budget
      const remainingBudget = totalBudget - totalExpenses;

      // Process top categories
      const categoryMap = {};
      expenses.forEach(expense => {
        const category = expense.category || 'Other';
        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }
        categoryMap[category] += parseFloat(expense.amount) || 0;
      });

      const topCategories = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

      // Process recent transactions
      const recentTransactions = expenses
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date) : new Date(0);
          const dateB = b.date ? new Date(b.date) : new Date(0);
          return dateB - dateA;
        })
        .slice(0, 5);

      // Calculate percentages for pie chart
      const spentPercentage = totalBudget > 0
        ? (totalExpenses / totalBudget) * 100
        : 0;
      const remainingPercentage = 100 - spentPercentage;

      // Prepare dashboard data for the PDF report
      const dashboardData = {
        totalExpenses,
        totalBudget,
        remainingBudget,
        topCategories,
        recentTransactions,
        spentPercentage,
        remainingPercentage
      };

      // Generate the PDF report
      const { filePath, filename } = await reportService.generatePdfReport(
        dashboardData,
        startDate,
        endDate,
        userId
      );

      // Log the report download
      await reportService.addReportDownloadLog(
        userId,
        { startDate: startDateObj, endDate: endDateObj },
        filename
      );

      // Send the file as a download
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          return res.status(500).json({ message: 'Error downloading report' });
        }

        // Clean up the file after it's been sent
        reportService.cleanupReport(filePath).catch(err => {
          console.error('Error cleaning up report file:', err);
        });
      });
    } catch (error) {
      console.error('Error generating report:', error);
      return this.sendError(res, 'Failed to generate report: ' + error.message);
    }
  }
}

module.exports = new ReportController();
