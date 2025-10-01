const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs-extra');
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

    
      const result = await reportService.addReportDownloadLog(userId, dateRange, fileName);


      expect(result).to.have.property('_id', 'log123');
      expect(result).to.have.property('userId', userId);
      expect(result).to.have.property('fileName', fileName);
    });

    it('should throw an error if saving fails', async () => {
     
      const error = new Error('Database error');
      sandbox.stub(ReportDownload.prototype, 'save').rejects(error);

     
      try {
        await reportService.addReportDownloadLog('user123', {}, 'file.pdf');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('should save with correct data structure', async () => {
     
      const userId = 'user123';
      const dateRange = { startDate: '2023-01-01', endDate: '2023-01-31' };
      const fileName = 'report.pdf';

      let capturedData = null;

      const saveStub = sandbox.stub().callsFake(function() {
        capturedData = this;
        return Promise.resolve({ ...this, _id: 'log123' });
      });

      sandbox.stub(ReportDownload.prototype, 'save').callsFake(saveStub);

     
      await reportService.addReportDownloadLog(userId, dateRange, fileName);


      expect(capturedData).to.have.property('userId', userId);
      expect(capturedData).to.have.property('dateRange').that.deep.equals(dateRange);
      expect(capturedData).to.have.property('fileName', fileName);
      expect(capturedData).to.have.property('downloadTime').that.is.an.instanceOf(Date);
    });
  });

  describe('getReportDownloadLogs', () => {
    it('should return download logs for a user', async () => {
     
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

     
      const result = await reportService.getReportDownloadLogs(userId);


      expect(ReportDownload.find.calledWith({ userId })).to.be.true;
      expect(result).to.equal(expectedLogs);
    });

    it('should apply pagination options correctly', async () => {
     
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

     
      await reportService.getReportDownloadLogs(userId, options);

     
      expect(ReportDownload.find.calledWith({ userId })).to.be.true;
      expect(sortStub.calledOnce).to.be.true;
      const sortArg = sortStub.firstCall.args[0];
      expect(sortArg).to.have.property('fileName', 1);
    });

    it('should handle errors when fetching logs', async () => {
     
      const error = new Error('Database error');
      sandbox.stub(ReportDownload, 'find').rejects(error);

     
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
     
      const userId = 'user123';
      const deleteResult = { deletedCount: 5 };
      sandbox.stub(ReportDownload, 'deleteMany').resolves(deleteResult);

     
      const result = await reportService.clearReportDownloadLogs(userId);

     
      expect(ReportDownload.deleteMany.calledWith({ userId })).to.be.true;
      expect(result).to.deep.equal({ deleted: 5 });
    });

    it('should return zero count when no logs exist', async () => {
     
      sandbox.stub(ReportDownload, 'deleteMany').resolves({ deletedCount: 0 });

     
      const result = await reportService.clearReportDownloadLogs('user123');

     
      expect(result).to.deep.equal({ deleted: 0 });
    });

    it('should handle errors during deletion', async () => {
     
      const error = new Error('Database error');
      sandbox.stub(ReportDownload, 'deleteMany').rejects(error);

     
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

     
      sandbox.stub(fs, 'ensureDir').resolves();

      
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

      
      sandbox.stub(reportService, 'generateReportHtml').returns('<html>Test</html>');

      
      const result = await reportService.generatePdfReport(reportData, startDate, endDate, userId);

      
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
     
      sandbox.stub(fs, 'ensureDir').resolves();
      sandbox.stub(puppeteer, 'launch').rejects(new Error('Puppeteer error'));

      
      try {
        await reportService.generatePdfReport({}, '2023-01-01', '2023-01-31', 'user123');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err.message).to.equal('Failed to generate PDF report');
      }
    });

    it('should format dates correctly', async () => {
     
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

      
      await reportService.generatePdfReport(
        { totalExpenses: 0, totalBudget: 0, remainingBudget: 0, spentPercentage: 0, remainingPercentage: 100 },
        '2023-01-01',
        '2023-01-31',
        'user123'
      );

      
      expect(htmlStub.calledOnce).to.be.true;
      const [, formattedStartDate, formattedEndDate] = htmlStub.firstCall.args;
      expect(formattedStartDate).to.be.a('string');
      expect(formattedEndDate).to.be.a('string');
    });
  });

  describe('generateReportHtml', () => {
    it('should generate HTML with correct data', () => {
     
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

      
      const html = reportService.generateReportHtml(data, startDate, endDate);

      
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
      
      const data = {
        totalExpenses: 1000,
        totalBudget: 1500,
        remainingBudget: 500,
        spentPercentage: 66.7,
        remainingPercentage: 33.3,
        topCategories: [],
        recentTransactions: []
      };

      
      const html = reportService.generateReportHtml(data, '1/1/2023', '1/31/2023');

      
      expect(html).to.be.a('string');
      expect(html).to.include('No category data available');
      expect(html).to.include('No transactions in this period');
    });

    it('should format budget status correctly based on remaining budget', () => {
      
      const overBudgetData = {
        totalExpenses: 2000,
        totalBudget: 1500,
        remainingBudget: -500,
        spentPercentage: 133.3,
        remainingPercentage: -33.3
      };

      
      const overBudgetHtml = reportService.generateReportHtml(
        overBudgetData, '1/1/2023', '1/31/2023'
      );

      
      expect(overBudgetHtml).to.include('Over budget by');
      expect(overBudgetHtml).to.include('$500.00');

      
      const underBudgetData = {
        totalExpenses: 1000,
        totalBudget: 1500,
        remainingBudget: 500,
        spentPercentage: 66.7,
        remainingPercentage: 33.3
      };

      
      const underBudgetHtml = reportService.generateReportHtml(
        underBudgetData, '1/1/2023', '1/31/2023'
      );

      
      expect(underBudgetHtml).to.include('Under budget by');
      expect(underBudgetHtml).to.include('$500.00');
    });
  });
});
