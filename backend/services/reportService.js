// services/reportService.js
import ReportRepository from '../repositories/reportRepository.js';

class ReportService {
  constructor() {
    this.reportRepository = new ReportRepository();
  }

  async getReportsByUser(userId) {
    return this.reportRepository.find({ userId });
  }

  async createReport(data) {
    return this.reportRepository.create(data);
  }

  async getReportById(id) {
    return this.reportRepository.findById(id);
  }

  async updateReport(id, data) {
    return this.reportRepository.update(id, data);
  }

  async deleteReport(id) {
    return this.reportRepository.delete(id);
  }
}

export default new ReportService();