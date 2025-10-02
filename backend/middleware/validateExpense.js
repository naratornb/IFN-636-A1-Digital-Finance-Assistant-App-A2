
  export const validateExpense = (req, res, next) => {
    const { category, amount, date } = req.body;
    if (!category || amount == null || !date) {
      return res.status(400).json({ message: 'Category, amount, and date are required.' });
    }
    if (amount < 0) {
      return res.status(400).json({ message: 'Amount cannot be negative.' });
    }
    const allowedCategories = ['Housing','Transportation','Food','Utilities','Healthcare','Insurance','Debt','Entertainment','Personal','Savings','Other'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category.' });
    }

    if (isNaN(new Date(date))) {
      return res.status(400).json({ message: 'Invalid date.' });
    }
    next();
  };