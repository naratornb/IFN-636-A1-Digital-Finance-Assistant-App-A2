const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const reportRepository = require('../repositories/reportRepository');

class ReportService {
  async generateAndSaveReport(userId, data, startDate, endDate) {
    const { filePath, filename } = await this.generatePdfReport(data, startDate, endDate, userId);
    await reportRepository.createLog({
      userId,
      dateRange: { startDate, endDate },
      fileName: filename
    });
    return { filePath, filename };
  }

  generateReportHtml(data, startDate, endDate) {
    const { totalExpenses, totalBudget, remainingBudget, spentPercentage, remainingPercentage, topCategories = [], recentTransactions = [] } = data;

    return `<html> ... full HTML content ... </html>`;
  }

  async generateReport(data, startDate, endDate, userId, format = 'pdf') {
    const strategies = {
      pdf: () => this.generatePdfReport(data, startDate, endDate, userId),
      json: async () => {
        const jsonData = JSON.stringify(data, null, 2);
        const filePath = path.join(__dirname, '../reports', `report_${userId}_${Date.now()}.json`);
        await fs.outputFile(filePath, jsonData);
        return { filePath, filename: path.basename(filePath) };
      }
    };
    return strategies[format]();
  }

  async generatePdfReport(reportData, startDate, endDate, userId) {
    const htmlContent = this.generateReportHtml(reportData, startDate, endDate);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const filename = `report_${userId}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../reports', filename);
    await page.pdf({ path: filePath, format: 'A4' });
    await browser.close();
    return { filePath, filename };
  }

  async getLogs(userId, options = {}) {
    return reportRepository.getLogs(userId, options);
  }

  async clearLogs(userId) {
    return reportRepository.deleteLogs(userId);
  }
}

module.exports = new ReportService();