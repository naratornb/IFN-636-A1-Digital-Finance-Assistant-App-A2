
const reportService = require('../services/reportService');

class ReportController {
  async generateReport(req, res) {
    try {
      const { startDate, endDate, data, format } = req.body;
      const userId = req.user.id;
      const result = await reportService.generateAndSaveReport(userId, data, startDate, endDate, format);
      res.json({ message: 'Report generated successfully', ...result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating report' });
    }
  }

  async getReportLogs(req, res) {
    try {
      const userId = req.user.id;
      const logs = await reportService.getLogs(userId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching logs' });
    }
  }

  async clearReportLogs(req, res) {
    try {
      const userId = req.user.id;
      const result = await reportService.clearLogs(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error clearing logs' });
    }
  }
}

module.exports = new ReportController();