
export const validateGoal = (req, res, next) => {
  const { name, target, deadline } = req.body;
  if (!name || target == null || !deadline) {
    return res.status(400).json({ message: 'Name, target, and deadline are required.' });
  }
  if (target < 0) {
    return res.status(400).json({ message: 'Target cannot be negative.' });
  }

  if (new Date(deadline) <= new Date()) {
    return res.status(400).json({ message: 'Deadline must be in the future.' });
  }
  next();
};