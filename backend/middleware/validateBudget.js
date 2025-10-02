
  export const validateBudget = (req, res, next) => {
    const { period, totalBudget, startDate, endDate } = req.body;
    if (!period || totalBudget == null || !startDate || !endDate) {
      return res.status(400).json({ message: 'Period, totalBudget, startDate, and endDate are required.' });
    }
    if (!['weekly', 'monthly'].includes(period)) {
      return res.status(400).json({ message: 'Invalid period. Must be weekly or monthly.' });
    }
    if (totalBudget < 0) {
      return res.status(400).json({ message: 'Total budget cannot be negative.' });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be before end date.' });
    }
    next();
  };