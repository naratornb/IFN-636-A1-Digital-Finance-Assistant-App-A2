const { ReportDownload } = require('../models/Report');

class ReportRepository {
  async createLog(logData) {
    return await ReportDownload.create(logData);
  }

  async getLogs(userId, options = {}) {
    const { limit = 10, skip = 0, sortBy = 'downloadTime', sortOrder = -1 } = options;
    return await ReportDownload.find({ userId })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
  }

  async deleteLogs(userId) {
    return await ReportDownload.deleteMany({ userId });
  }
}

module.exports = new ReportRepository();