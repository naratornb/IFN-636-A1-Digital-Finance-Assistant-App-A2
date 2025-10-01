import ReportService from '../services/reportService.js';

describe('Report Service', () => {
  const mockId = '64f6b6a4f1c2b3d4e5f6a7d0';
  const userId = '64f6b6a4f1c2b3d4e5f6a7d1';

  describe('createReport', () => {
    it('should create a report successfully', async () => {
      const data = { userId, title: 'Monthly', description: 'Finance Report', reportdate: new Date() };
      const result = await ReportService.createReport(data);
      expect(result).toMatchObject(data);
    });

    it('should fail if data is invalid', async () => {
      await expect(ReportService.createReport({})).rejects.toThrow();
    });

    it('should handle repository error', async () => {
      await expect(ReportService.createReport(null)).rejects.toThrow();
    });
  });

  describe('getReports', () => {
    it('should return list of reports', async () => {
      const result = await ReportService.getReportsByUser(userId);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty list if none found', async () => {
      const result = await ReportService.getReportsByUser('000000000000000000000000');
      expect(result).toEqual([]);
    });

    it('should handle repository error', async () => {
      await expect(ReportService.getReportsByUser(null)).rejects.toThrow();
    });
  });

  describe('updateReport', () => {
    it('should update successfully', async () => {
      const data = { title: 'Monthly Updated', description: 'Finance Updated' };
      const result = await ReportService.updateReport(mockId, data);
      expect(result).toMatchObject(data);
    });

    it('should fail for invalid id', async () => {
      await expect(ReportService.updateReport('invalidId', {})).rejects.toThrow();
    });

    it('should handle repository error', async () => {
      await expect(ReportService.updateReport(null, {})).rejects.toThrow();
    });
  });

  describe('deleteReport', () => {
    it('should delete successfully', async () => {
      const result = await ReportService.deleteReport(mockId);
      expect(result).toHaveProperty('_id');
    });

    it('should fail for invalid id', async () => {
      await expect(ReportService.deleteReport('invalidId')).rejects.toThrow();
    });

    it('should handle repository error', async () => {
      await expect(ReportService.deleteReport(null)).rejects.toThrow();
    });
  });
});
