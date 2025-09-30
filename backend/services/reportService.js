const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const { ReportDownload } = require('../models/Report');

class ReportService {
  /**
   * Logs a report download
   * @param {string} userId - ID of the user downloading the report
   * @param {Object} dateRange - Date range of the report
   * @param {string} fileName - Name of the downloaded file
   * @returns {Promise<Object>} - The created log entry
   */
  async addReportDownloadLog(userId, dateRange, fileName) {
    try {
      const downloadLog = new ReportDownload({
        userId,
        dateRange,
        fileName,
        downloadTime: new Date()
      });

      const savedLog = await downloadLog.save();
      return savedLog;
    } catch (error) {
      console.error('Error logging report download:', error);
      throw error;
    }
  }

  /**
   * Get all report download logs for a user
   * @param {string} userId - ID of the user
   * @param {Object} options - Pagination options
   * @returns {Promise<Array>} - Array of download logs
   */
  async getReportDownloadLogs(userId, options = {}) {
    try {
      const { limit = 10, skip = 0, sortBy = 'downloadTime', sortOrder = -1 } = options;

      const sort = {};
      sort[sortBy] = sortOrder;

      const logs = await ReportDownload.find({ userId })
        .sort(sort)
        .limit(limit)
        .skip(skip);

      return logs;
    } catch (error) {
      console.error('Error getting report download logs:', error);
      throw error;
    }
  }

  /**
   * Clear all report download logs for a user
   * @param {string} userId - ID of the user
   * @returns {Promise<Object>} - Result of deletion
   */
  async clearReportDownloadLogs(userId) {
    try {
      const result = await ReportDownload.deleteMany({ userId });
      return { deleted: result.deletedCount };
    } catch (error) {
      console.error('Error clearing report download logs:', error);
      throw error;
    }
  }

  /**
   * Generates a PDF report based on provided data
   * @param {Object} reportData - Data to be included in the report
   * @param {string} startDate - Start date of the report period
   * @param {string} endDate - End date of the report period
   * @param {string} userId - User ID for identifying the report
   * @returns {Promise<string>} - Path to the generated PDF file
   */
  async generatePdfReport(reportData, startDate, endDate, userId) {
    try {
      // Create directory for reports if it doesn't exist
      const reportDir = path.join(__dirname, '../reports');
      await fs.ensureDir(reportDir);

      // Create a unique filename for the report
      const timestamp = new Date().getTime();
      const filename = `financial_report_${userId}_${timestamp}.pdf`;
      const filePath = path.join(reportDir, filename);

      // Format dates for display
      const formattedStartDate = new Date(startDate).toLocaleDateString();
      const formattedEndDate = new Date(endDate).toLocaleDateString();

      // Launch a headless browser
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();

      // Generate HTML content for the report
      const htmlContent = this.generateReportHtml(reportData, formattedStartDate, formattedEndDate);

      // Set the HTML content
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      await page.pdf({
        path: filePath,
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      await browser.close();

      return {
        filePath,
        filename
      };
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  /**
   * Generates HTML content for the report
   * @param {Object} data - Report data
   * @param {string} startDate - Formatted start date
   * @param {string} endDate - Formatted end date
   * @returns {string} - HTML content
   */
  generateReportHtml(data, startDate, endDate) {
    const {
      totalExpenses,
      totalBudget,
      remainingBudget,
      spentPercentage,
      remainingPercentage,
      topCategories = [],
      recentTransactions = []
    } = data;

    // Generate HTML for top categories
    let categoriesHtml = '';
    if (topCategories.length > 0) {
      topCategories.forEach(category => {
        const percentage = (category.value / totalExpenses) * 100;
        categoriesHtml += `
          <div class="category-item">
            <div class="category-header">
              <span>${category.name}</span>
              <span>$${category.value.toFixed(2)}</span>
            </div>
            <div class="category-bar-bg">
              <div class="category-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="category-percentage">${percentage.toFixed(1)}% of total</div>
          </div>
        `;
      });
    } else {
      categoriesHtml = '<p class="no-data">No category data available</p>';
    }

    // Generate HTML for transactions
    let transactionsHtml = '';
    if (recentTransactions.length > 0) {
      recentTransactions.forEach(transaction => {
        const transDate = transaction.date ? new Date(transaction.date).toLocaleDateString() : 'No date';
        transactionsHtml += `
          <div class="transaction-item">
            <div class="transaction-info">
              <div class="transaction-desc">${transaction.description || 'Unnamed Transaction'}</div>
              <div class="transaction-meta">${transDate} • ${transaction.category || 'Uncategorized'}</div>
            </div>
            <span class="transaction-amount">-$${parseFloat(transaction.amount).toFixed(2)}</span>
          </div>
        `;
      });
    } else {
      transactionsHtml = '<p class="no-data">No transactions in this period</p>';
    }

    // Return the complete HTML content
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Financial Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #4d4d4d;
              color: white;
              padding: 20px;
              margin: 0;
            }
            .container {
              max-width: 1000px;
              margin: 0 auto;
            }
            .header {
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 24px;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              margin-bottom: 5px;
            }
            .header p {
              color: #cfcfcf;
            }
            .report-info {
              background-color: #5a5a5a;
              border: 1px solid #707070;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 20px;
              text-align: center;
            }
            .cards-container {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              margin-bottom: 20px;
            }
            .card {
              background-color: #5a5a5a;
              border: 1px solid #707070;
              border-radius: 8px;
              padding: 15px;
              flex: 1;
            }
            .card-header {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
            }
            .card-icon {
              background-color: #4d4d4d;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 10px;
            }
            .card-title {
              font-size: 16px;
              text-transform: uppercase;
              letter-spacing: 0.15em;
            }
            .card-value {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .card-subtitle {
              font-size: 12px;
              color: #cfcfcf;
            }
            .charts-container {
              display: flex;
              gap: 20px;
              margin-bottom: 20px;
            }
            .chart-card {
              background-color: #5a5a5a;
              border: 1px solid #707070;
              border-radius: 8px;
              padding: 15px;
              flex: 1;
            }
            .chart-header {
              font-size: 18px;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              margin-bottom: 15px;
            }
            .pie-container {
              position: relative;
              width: 200px;
              height: 200px;
              margin: 0 auto 20px;
            }
            .pie-chart {
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background: conic-gradient(
                #f87171 0% ${spentPercentage}%, 
                #60a5fa ${spentPercentage}% 100%
              );
            }
            .pie-center {
              position: absolute;
              width: 60%;
              height: 60%;
              top: 20%;
              left: 20%;
              background-color: #5a5a5a;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
            }
            .pie-percentage {
              font-size: 24px;
              font-weight: bold;
            }
            .pie-label {
              font-size: 12px;
              color: #cfcfcf;
            }
            .legend {
              display: flex;
              justify-content: center;
              gap: 30px;
            }
            .legend-item {
              display: flex;
              align-items: center;
            }
            .legend-color {
              width: 16px;
              height: 16px;
              border-radius: 4px;
              margin-right: 8px;
            }
            .spent-color {
              background-color: #f87171;
            }
            .remaining-color {
              background-color: #60a5fa;
            }
            .legend-text {
              display: flex;
              flex-direction: column;
            }
            .legend-label {
              font-size: 14px;
              margin-bottom: 2px;
            }
            .legend-value {
              font-size: 12px;
              color: #cfcfcf;
            }
            .budget-bars {
              margin-top: 20px;
            }
            .budget-bar-item {
              margin-bottom: 15px;
            }
            .budget-bar-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .budget-bar-bg {
              background-color: #4a4a4a;
              height: 12px;
              border-radius: 6px;
              overflow: hidden;
            }
            .budget-bar {
              height: 100%;
              border-radius: 6px;
            }
            .budget-bar-blue {
              background-color: #60a5fa;
            }
            .budget-bar-red {
              background-color: #f87171;
            }
            .status-indicator {
              margin-top: 15px;
              padding-top: 15px;
              border-top: 1px solid #4a4a4a;
              display: flex;
              align-items: center;
            }
            .status-text {
              font-size: 14px;
            }
            .positive-text {
              color: #4ade80;
            }
            .negative-text {
              color: #f87171;
            }
            .data-section {
              display: flex;
              gap: 20px;
            }
            .data-card {
              background-color: #5a5a5a;
              border: 1px solid #707070;
              border-radius: 8px;
              padding: 15px;
              flex: 1;
            }
            .data-header {
              font-size: 18px;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              margin-bottom: 15px;
            }
            .category-item {
              margin-bottom: 15px;
            }
            .category-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-size: 14px;
            }
            .category-bar-bg {
              background-color: #4a4a4a;
              height: 8px;
              border-radius: 4px;
              overflow: hidden;
            }
            .category-bar {
              height: 100%;
              background-color: #f5c400;
              border-radius: 4px;
            }
            .category-percentage {
              font-size: 12px;
              color: #cfcfcf;
              margin-top: 2px;
            }
            .transaction-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            }
            .transaction-desc {
              font-size: 14px;
              margin-bottom: 2px;
            }
            .transaction-meta {
              font-size: 12px;
              color: #cfcfcf;
            }
            .transaction-amount {
              font-weight: bold;
              color: #f87171;
            }
            .no-data {
              text-align: center;
              color: #aaaaaa;
              padding: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #707070;
              color: #cfcfcf;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Financial Report</h1>
              <p>Report period: ${startDate} - ${endDate}</p>
            </div>
            
            <div class="report-info">
              <h2>Financial Summary</h2>
            </div>
            
            <div class="cards-container">
              <div class="card">
                <div class="card-header">
                  <div class="card-icon">$</div>
                  <div class="card-title">Total Expenses</div>
                </div>
                <div class="card-value">$${totalExpenses.toFixed(2)}</div>
                <div class="card-subtitle">${startDate} - ${endDate}</div>
              </div>
              
              <div class="card">
                <div class="card-header">
                  <div class="card-icon">B</div>
                  <div class="card-title">Total Budget</div>
                </div>
                <div class="card-value">$${totalBudget.toFixed(2)}</div>
                <div class="card-subtitle">${startDate} - ${endDate}</div>
              </div>
              
              <div class="card">
                <div class="card-header">
                  <div class="card-icon">R</div>
                  <div class="card-title">Remaining Budget</div>
                </div>
                <div class="card-value" style="color: ${remainingBudget >= 0 ? '#4ade80' : '#f87171'}">
                  $${Math.abs(remainingBudget).toFixed(2)}
                </div>
                <div class="card-subtitle">
                  ${remainingBudget >= 0 ? 'Under budget' : 'Over budget'}
                </div>
              </div>
            </div>
            
            <div class="charts-container">
              <div class="chart-card">
                <div class="chart-header">Budget Utilization</div>
                <div class="pie-container">
                  <div class="pie-chart"></div>
                  <div class="pie-center">
                    <div class="pie-percentage">${spentPercentage.toFixed(1)}%</div>
                    <div class="pie-label">Spent</div>
                  </div>
                </div>
                
                <div class="legend">
                  <div class="legend-item">
                    <div class="legend-color spent-color"></div>
                    <div class="legend-text">
                      <div class="legend-label">Spent</div>
                      <div class="legend-value">$${totalExpenses.toFixed(2)} (${spentPercentage.toFixed(1)}%)</div>
                    </div>
                  </div>
                  
                  <div class="legend-item">
                    <div class="legend-color remaining-color"></div>
                    <div class="legend-text">
                      <div class="legend-label">Remaining</div>
                      <div class="legend-value">$${Math.abs(remainingBudget).toFixed(2)} (${remainingPercentage.toFixed(1)}%)</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="chart-card">
                <div class="chart-header">Budget Status</div>
                <div class="budget-bars">
                  <div class="budget-bar-item">
                    <div class="budget-bar-header">
                      <span>Total Budget</span>
                      <span>$${totalBudget.toFixed(2)}</span>
                    </div>
                    <div class="budget-bar-bg">
                      <div class="budget-bar budget-bar-blue" style="width: 100%"></div>
                    </div>
                  </div>
                  
                  <div class="budget-bar-item">
                    <div class="budget-bar-header">
                      <span>Amount Spent</span>
                      <span>$${totalExpenses.toFixed(2)}</span>
                    </div>
                    <div class="budget-bar-bg">
                      <div class="budget-bar budget-bar-red" style="width: ${spentPercentage}%"></div>
                    </div>
                  </div>
                </div>
                
                <div class="status-indicator">
                  <span class="status-text ${remainingBudget >= 0 ? 'positive-text' : 'negative-text'}">
                    ${remainingBudget >= 0 ? 'Under budget by' : 'Over budget by'} $${Math.abs(remainingBudget).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="data-section">
              <div class="data-card">
                <div class="data-header">Top Spending Categories</div>
                ${categoriesHtml}
              </div>
              
              <div class="data-card">
                <div class="data-header">Transactions in Period</div>
                ${transactionsHtml}
              </div>
            </div>
            
            <div class="footer">
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Deletes a report file after it's been downloaded
   * @param {string} filePath - Path to the file to delete
   * @returns {Promise<void>}
   */
  async cleanupReport(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting report file:', error);
    }
  }
}

module.exports = new ReportService();
