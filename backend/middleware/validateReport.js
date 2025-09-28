// middleware/validateReport.js
export const validateReport = (req, res, next) => {
    const { title, reportdate } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (reportdate && isNaN(Date.parse(reportdate))) {
      return res.status(400).json({ message: 'Invalid report date' });
    }
    next();
  };