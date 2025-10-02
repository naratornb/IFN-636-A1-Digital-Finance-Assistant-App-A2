const express = require('express');
const cors = require('cors');
const budgetRoutes = require('./routes/budgetRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const goalRoutes = require('./routes/goalRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const logger = require('./config/logger');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/expenses', expenseRoutes);

app.use((err, req, res, next) => {
  logger.log(`Error: ${err.message}`);
  res.status(500).json({ success: false, message: err.message });
});

module.exports = app;
