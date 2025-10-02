const mongoose = require('mongoose');

const reportDownloadSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  dateRange: { type: Object, required: true },
  fileName: { type: String, required: true },
  downloadTime: { type: Date, default: Date.now }
});

const ReportDownload = mongoose.model('ReportDownload', reportDownloadSchema);

module.exports = { ReportDownload };