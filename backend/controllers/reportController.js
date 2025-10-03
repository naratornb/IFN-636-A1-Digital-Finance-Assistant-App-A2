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
   * @param {Object} req 
   * @param {Object} res 
   * @returns {Promise<void>}
   */
  async getDashboardData(req, res) {
    try {
      let startDate, endDate;

      if (req.query.startDate && req.query.endDate) {
        startDate = new Date(req.query.startDate);
        endDate = new Date(req.query.endDate);

        endDate.setHours(23, 59, 59, 999);
      } else {
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 365);
      }

      const userId = req.user._id;

      const expenses = await Expense.find({
        userId: userId,
        date: { $gte: startDate, $lte: endDate }
      });

      const budgets = await Budget.find({
        userId: userId,
        startDate: { $lte: endDate },
        $or: [
          { endDate: null },
          { endDate: { $gte: startDate } }
        ]
      });

      const totalExpenses = expenses.length > 0
        ? expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
        : 0;

      let totalBudget = 0;
      if (budgets.length > 0) {
        for (const budget of budgets) {
          const budgetAmount = parseFloat(budget.totalBudget) || 0;

          const budgetStart = budget.startDate ? new Date(Math.max(budget.startDate, startDate)) : new Date(startDate);
          const budgetEnd = budget.endDate ? new Date(Math.min(budget.endDate, endDate)) : new Date(endDate);

          const daysInPeriod = Math.ceil((budgetEnd - budgetStart) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

          const budgetStartDate = budget.startDate ? new Date(budget.startDate) : new Date(startDate);
          const budgetEndDate = budget.endDate ? new Date(budget.endDate) : new Date(endDate);
          const totalBudgetDays = Math.ceil((budgetEndDate - budgetStartDate) / (1000 * 60 * 60 * 24)) + 1;

          const proratedBudget = totalBudgetDays > 0 ? (budgetAmount / totalBudgetDays) * daysInPeriod : 0;

          totalBudget += proratedBudget;
        }
      }

      const remainingBudget = totalBudget - totalExpenses;

      const expenseTrend = [];
      const dateDiff = endDate.getTime() - startDate.getTime();
      const segmentDuration = dateDiff / 6; 

      for (let i = 0; i < 6; i++) {
        const segmentStart = new Date(startDate.getTime() + (segmentDuration * i));
        const segmentEnd = new Date(startDate.getTime() + (segmentDuration * (i + 1)));

        let segmentLabel;
        if (dateDiff <= 7 * 24 * 60 * 60 * 1000) { 
          segmentLabel = segmentStart.toLocaleDateString('default', { day: 'numeric' });
        } else if (dateDiff <= 60 * 24 * 60 * 60 * 1000) { 
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

      const budgetComparison = [];

      for (let i = 0; i < 6; i++) {
        const segmentStart = new Date(startDate.getTime() + (segmentDuration * i));
        const segmentEnd = new Date(startDate.getTime() + (segmentDuration * (i + 1)));

        let segmentLabel;
        if (dateDiff <= 7 * 24 * 60 * 60 * 1000) { 
          segmentLabel = segmentStart.toLocaleDateString('default', { day: 'numeric' });
        } else if (dateDiff <= 60 * 24 * 60 * 60 * 1000) { 
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

        const relevantBudgets = budgets.filter(budget => {
          const budgetStart = budget.startDate ? new Date(budget.startDate) : null;
          const budgetEnd = budget.endDate ? new Date(budget.endDate) : null;

          if (!budgetStart) return false;

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

      const recentTransactions = expenses
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date) : new Date(0);
          const dateB = b.date ? new Date(b.date) : new Date(0);
          return dateB - dateA;
        })
        .slice(0, 5);

      const spentPercentage = totalBudget > 0
        ? (totalExpenses / totalBudget) * 100
        : 0;
      const remainingPercentage = 100 - spentPercentage;

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
   * @param {Object} req 
   * @param {Object} res 
   * @returns {Promise<void>}
   */
  async getDownloadLogs(req, res) {
    try {
      const userId = req.user._id;

      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'downloadTime';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

      const logs = await reportService.getReportDownloadLogs(userId, {
        limit,
        skip,
        sortBy,
        sortOrder
      });

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
   * @param {Object} req 
   * @param {Object} res 
   * @returns {Promise<void>}
   */
  async clearDownloadLogs(req, res) {
    try {
      const userId = req.user._id;

      const result = await reportService.clearReportDownloadLogs(userId);

      return this.sendSuccess(res, result, `Successfully cleared ${result.deleted} download logs`);
    } catch (error) {
      console.error('Error clearing report download logs:', error);
      return this.sendError(res, error.message);
    }
  }

  /**
   * @param {Object} req 
   * @param {Object} res 
   * @returns {Promise<void>}
   */
  async generatePdf(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return this.sendError(res, 'Start date and end date are required', 400);
      }

      const userId = req.user._id;

      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);

      const expenses = await Expense.find({
        userId: userId,
        date: { $gte: startDateObj, $lte: endDateObj }
      });

      const budgets = await Budget.find({
        userId: userId,
        startDate: { $lte: endDateObj },
        $or: [
          { endDate: null },
          { endDate: { $gte: startDateObj } }
        ]
      });

      const totalExpenses = expenses.length > 0
        ? expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
        : 0;

      let totalBudget = 0;
      if (budgets.length > 0) {
        for (const budget of budgets) {
          const budgetAmount = parseFloat(budget.totalBudget) || 0;

          const budgetStart = budget.startDate ? new Date(Math.max(budget.startDate, startDateObj)) : new Date(startDateObj);
          const budgetEnd = budget.endDate ? new Date(Math.min(budget.endDate, endDateObj)) : new Date(endDateObj);

          const daysInPeriod = Math.ceil((budgetEnd - budgetStart) / (1000 * 60 * 60 * 24)) + 1;

          const budgetStartDate = budget.startDate ? new Date(budget.startDate) : new Date(startDateObj);
          const budgetEndDate = budget.endDate ? new Date(budget.endDate) : new Date(endDateObj);
          const totalBudgetDays = Math.ceil((budgetEndDate - budgetStartDate) / (1000 * 60 * 60 * 24)) + 1;

          const proratedBudget = totalBudgetDays > 0 ? (budgetAmount / totalBudgetDays) * daysInPeriod : 0;

          totalBudget += proratedBudget;
        }
      }

      const remainingBudget = totalBudget - totalExpenses;

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

      const recentTransactions = expenses
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date) : new Date(0);
          const dateB = b.date ? new Date(b.date) : new Date(0);
          return dateB - dateA;
        })
        .slice(0, 5);

      const spentPercentage = totalBudget > 0
        ? (totalExpenses / totalBudget) * 100
        : 0;
      const remainingPercentage = 100 - spentPercentage;

      const dashboardData = {
        totalExpenses,
        totalBudget,
        remainingBudget,
        topCategories,
        recentTransactions,
        spentPercentage,
        remainingPercentage
      };

      const { filePath, filename } = await reportService.generatePdfReport(
        dashboardData,
        startDate,
        endDate,
        userId
      );

      await reportService.addReportDownloadLog(
        userId,
        { startDate: startDateObj, endDate: endDateObj },
        filename
      );

      res.download(filePath, filename, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          return res.status(500).json({ message: 'Error downloading report' });
        }

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
