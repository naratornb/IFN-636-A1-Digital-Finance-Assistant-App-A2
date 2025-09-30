const mongoose = require('mongoose');

const ReportDownloadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateRange: {
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  fileName: {
    type: String,
  },
  downloadTime: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const ReportDownload = mongoose.model('ReportDownload', ReportDownloadSchema);

module.exports = { ReportDownload };
