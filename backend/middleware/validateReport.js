
  export const validateReport = (req, res, next) => {
    const { startDate, endDate, format } = req.body;
    if (!startDate || !endDate || !format) {
      return res.status(400).json({ message: 'startDate, endDate, and format are required.' });
    }
    if (!['pdf', 'json'].includes(format)) {
      return res.status(400).json({ message: 'Invalid format. Must be pdf or json.' });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'startDate must be before endDate.' });
    }
    next();
  };