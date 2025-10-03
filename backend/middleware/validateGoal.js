export const validateGoal = (req, res, next) => {
  const { name, amount, deadline } = req.body;
  if (!name || !amount || !deadline) {
    return res.status(400).json({ message: 'Name, amount, and deadline are required' });
  }
  next();
};