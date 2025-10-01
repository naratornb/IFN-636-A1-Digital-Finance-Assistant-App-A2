const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');
const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const { ReportDownload } = require('../models/Report');
const reportService = require('../services/reportService');

describe('ReportService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('addReportDownloadLog', () => {
    it('should create a new download log entry', async () => {
      // Setup
      const userId = 'user123';
      const dateRange = { startDate: '2023-01-01', endDate: '2023-01-31' };
      const fileName = 'financial_report_123.pdf';

      const saveStub = sandbox.stub().resolves({
        userId,
        dateRange,
        fileName,
        downloadTime: new Date(),
        _id: 'log123'
      });

      sandbox.stub(ReportDownload.prototype, 'save').callsFake(saveStub);

      // Execute
      const result = await reportService.addReportDownloadLog(userId, dateRange, fileName);

      // Verify
      expect(result).to.have.property('_id', 'log123');
      expect(result).to.have.property('userId', userId);
      expect(result).to.have.property('fileName', fileName);
    });

    it('should throw an error if saving fails', async () => {
      // Setup
      const error = new Error('Database error');
      sandbox.stub(ReportDownload.prototype, 'save').rejects(error);

      // Execute & Verify
      try {
        await reportService.addReportDownloadLog('user123', {}, 'file.pdf');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('should save with correct data structure', async () => {
      // Setup
      const userId = 'user123';
      const dateRange = { startDate: '2023-01-01', endDate: '2023-01-31' };
      const fileName = 'report.pdf';

      let capturedData = null;

      const saveStub = sandbox.stub().callsFake(function() {
        capturedData = this;
        return Promise.resolve({ ...this, _id: 'log123' });
      });

      sandbox.stub(ReportDownload.prototype, 'save').callsFake(saveStub);

      // Execute
      await reportService.addReportDownloadLog(userId, dateRange, fileName);

      // Verify
      expect(capturedData).to.have.property('userId', userId);
      expect(capturedData).to.have.property('dateRange').that.deep.equals(dateRange);
      expect(capturedData).to.have.property('fileName', fileName);
      expect(capturedData).to.have.property('downloadTime').that.is.an.instanceOf(Date);
    });
  });

  describe('getReportDownloadLogs', () => {
    it('should return download logs for a user', async () => {
      // Setup
      const userId = 'user123';
      const expectedLogs = [
        { _id: 'log1', userId, fileName: 'report1.pdf' },
        { _id: 'log2', userId, fileName: 'report2.pdf' }
      ];

      const findStub = sandbox.stub().returns({
        sort: sandbox.stub().returns({
          limit: sandbox.stub().returns({
            skip: sandbox.stub().resolves(expectedLogs)
          })
        })
      });

      sandbox.stub(ReportDownload, 'find').callsFake(findStub);

      // Execute
      const result = await reportService.getReportDownloadLogs(userId);

      // Verify
      expect(ReportDownload.find.calledWith({ userId })).to.be.true;
      expect(result).to.equal(expectedLogs);
    });

    it('should apply pagination options correctly', async () => {
      // Setup
      const userId = 'user123';
      const options = {
        limit: 5,
        skip: 10,
        sortBy: 'fileName',
        sortOrder: 1
      };

      const sortStub = sandbox.stub().returns({
        limit: sandbox.stub().returns({
          skip: sandbox.stub().resolves([])
        })
      });

      const findStub = sandbox.stub().returns({ sort: sortStub });
      sandbox.stub(ReportDownload, 'find').callsFake(findStub);

      // Execute
      await reportService.getReportDownloadLogs(userId, options);

      // Verify
      expect(ReportDownload.find.calledWith({ userId })).to.be.true;
      expect(sortStub.calledOnce).to.be.true;
      const sortArg = sortStub.firstCall.args[0];
      expect(sortArg).to.have.property('fileName', 1);
    });

    it('should handle errors when fetching logs', async () => {
      // Setup
      const error = new Error('Database error');
      sandbox.stub(ReportDownload, 'find').rejects(error);

      // Execute & Verify
      try {
        await reportService.getReportDownloadLogs('user123');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('clearReportDownloadLogs', () => {
    it('should delete all logs for a user', async () => {
      // Setup
      const userId = 'user123';
      const deleteResult = { deletedCount: 5 };
      sandbox.stub(ReportDownload, 'deleteMany').resolves(deleteResult);

      // Execute
      const result = await reportService.clearReportDownloadLogs(userId);

      // Verify
      expect(ReportDownload.deleteMany.calledWith({ userId })).to.be.true;
      expect(result).to.deep.equal({ deleted: 5 });
    });

    it('should return zero count when no logs exist', async () => {
      // Setup
      sandbox.stub(ReportDownload, 'deleteMany').resolves({ deletedCount: 0 });

      // Execute
      const result = await reportService.clearReportDownloadLogs('user123');

      // Verify
      expect(result).to.deep.equal({ deleted: 0 });
    });

    it('should handle errors during deletion', async () => {
      // Setup
      const error = new Error('Database error');
      sandbox.stub(ReportDownload, 'deleteMany').rejects(error);

      // Execute & Verify
      try {
        await reportService.clearReportDownloadLogs('user123');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('generatePdfReport', () => {
    it('should generate a PDF report', async () => {
      // Setup
      const reportData = {
        totalExpenses: 1000,
        totalBudget: 1500,
        remainingBudget: 500,
        spentPercentage: 66.7,
        remainingPercentage: 33.3,
        topCategories: [{ name: 'Food', value: 500 }],
        recentTransactions: [{ amount: 50, category: 'Food', date: new Date() }]
      };

      const userId = 'user123';
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';

      // Stub fs.ensureDir
      sandbox.stub(fs, 'ensureDir').resolves();

      // Stub puppeteer
      const pdfStub = sandbox.stub().resolves();
      const setContentStub = sandbox.stub().resolves();
      const pageStub = {
        setContent: setContentStub,
        pdf: pdfStub
      };
      const browserStub = {
        newPage: sandbox.stub().resolves(pageStub),
        close: sandbox.stub().resolves()
      };
      sandbox.stub(puppeteer, 'launch').resolves(browserStub);

      // Stub generateReportHtml
      sandbox.stub(reportService, 'generateReportHtml').returns('<html>Test</html>');

      // Execute
      const result = await reportService.generatePdfReport(reportData, startDate, endDate, userId);

      // Verify
      expect(fs.ensureDir.calledOnce).to.be.true;
      expect(puppeteer.launch.calledOnce).to.be.true;
      expect(setContentStub.calledOnce).to.be.true;
      expect(pdfStub.calledOnce).to.be.true;
      expect(browserStub.close.calledOnce).to.be.true;
      expect(result).to.have.property('filePath');
      expect(result).to.have.property('filename');
      expect(result.filename).to.include('financial_report_' + userId);
    });

    it('should throw an error if PDF generation fails', async () => {
      // Setup
      sandbox.stub(fs, 'ensureDir').resolves();
      sandbox.stub(puppeteer, 'launch').rejects(new Error('Puppeteer error'));

      // Execute & Verify
      try {
        await reportService.generatePdfReport({}, '2023-01-01', '2023-01-31', 'user123');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err.message).to.equal('Failed to generate PDF report');
      }
    });

    it('should format dates correctly', async () => {
      // Setup
      sandbox.stub(fs, 'ensureDir').resolves();

      const pageStub = {
        setContent: sandbox.stub().resolves(),
        pdf: sandbox.stub().resolves()
      };
      const browserStub = {
        newPage: sandbox.stub().resolves(pageStub),
        close: sandbox.stub().resolves()
      };
      sandbox.stub(puppeteer, 'launch').resolves(browserStub);

      const htmlStub = sandbox.stub(reportService, 'generateReportHtml');

      // Execute
      await reportService.generatePdfReport(
        { totalExpenses: 0, totalBudget: 0, remainingBudget: 0, spentPercentage: 0, remainingPercentage: 100 },
        '2023-01-01',
        '2023-01-31',
        'user123'
      );

      // Verify
      expect(htmlStub.calledOnce).to.be.true;
      const [, formattedStartDate, formattedEndDate] = htmlStub.firstCall.args;
      expect(formattedStartDate).to.be.a('string');
      expect(formattedEndDate).to.be.a('string');
    });
  });

  describe('generateReportHtml', () => {
    it('should generate HTML with correct data', () => {
      // Setup
      const data = {
        totalExpenses: 1000,
        totalBudget: 1500,
        remainingBudget: 500,
        spentPercentage: 66.7,
        remainingPercentage: 33.3,
        topCategories: [{ name: 'Food', value: 500 }],
        recentTransactions: [{ amount: 50, description: 'Lunch', category: 'Food', date: new Date() }]
      };
      const startDate = '1/1/2023';
      const endDate = '1/31/2023';

      // Execute
      const html = reportService.generateReportHtml(data, startDate, endDate);

      // Verify
      expect(html).to.be.a('string');
      expect(html).to.include('Financial Report');
      expect(html).to.include(startDate);
      expect(html).to.include(endDate);
      expect(html).to.include('$1000.00'); // totalExpenses
      expect(html).to.include('$1500.00'); // totalBudget
      expect(html).to.include('Food'); // category
      expect(html).to.include('Lunch'); // transaction description
    });

    it('should handle missing categories and transactions', () => {
      // Setup
      const data = {
        totalExpenses: 1000,
        totalBudget: 1500,
        remainingBudget: 500,
        spentPercentage: 66.7,
        remainingPercentage: 33.3,
        topCategories: [],
        recentTransactions: []
      };

      // Execute
      const html = reportService.generateReportHtml(data, '1/1/2023', '1/31/2023');

      // Verify
      expect(html).to.be.a('string');
      expect(html).to.include('No category data available');
      expect(html).to.include('No transactions in this period');
    });

    it('should format budget status correctly based on remaining budget', () => {
      // Setup - Over budget case
      const overBudgetData = {
        totalExpenses: 2000,
        totalBudget: 1500,
        remainingBudget: -500,
        spentPercentage: 133.3,
        remainingPercentage: -33.3
      };

      // Execute
      const overBudgetHtml = reportService.generateReportHtml(
        overBudgetData, '1/1/2023', '1/31/2023'
      );

      // Verify
      expect(overBudgetHtml).to.include('Over budget by');
      expect(overBudgetHtml).to.include('$500.00');

      // Setup - Under budget case
      const underBudgetData = {
        totalExpenses: 1000,
        totalBudget: 1500,
        remainingBudget: 500,
        spentPercentage: 66.7,
        remainingPercentage: 33.3
      };

      // Execute
      const underBudgetHtml = reportService.generateReportHtml(
        underBudgetData, '1/1/2023', '1/31/2023'
      );

      // Verify
      expect(underBudgetHtml).to.include('Under budget by');
      expect(underBudgetHtml).to.include('$500.00');
    });
  });
});
