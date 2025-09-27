// middleware/validateBudget.js
export const validateBudgetData = (req, res, next) => {
    const { period, totalBudget } = req.body;
    if (!period || !totalBudget) {
      return res.status(400).json({ message: 'Period and totalBudget are required' });
    }
    // Additional validation rules if needed
    next();
  };