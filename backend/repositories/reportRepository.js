// repositories/reportRepository.js
import BaseRepository from './baseRepository.js';
import Report from '../models/Report.js';

class ReportRepository extends BaseRepository {
  constructor() {
    super(Report);
  }

  // Additional methods if needed
  async findByUser(userId) {
    return this.model.find({ userId }).sort({ reportdate: -1 }).exec();
  }
}

export default ReportRepository;