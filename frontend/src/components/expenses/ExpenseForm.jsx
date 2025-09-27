// src/components/expenses/ExpenseForm.js
import React, { useState, useEffect } from 'react';
import { useExpenseContext } from '../../context/ExpenseContext';
import { useBudgetContext } from '../../context/BudgetContext';
import { useAuth } from '../../context/AuthContext';

const ExpenseForm = ({ expenseId, onSave, onCancel }) => {
  const { user } = useAuth();
  const { expense, isLoading: expenseLoading, error: expenseError, getExpense, createExpense, updateExpense, clearExpense } = useExpenseContext();
  const { budgets, getBudgets } = useBudgetContext();

  const [formData, setFormData] = useState({
    category: 'Food',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    budgetId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Housing', 'Transportation', 'Food', 'Utilities',
    'Healthcare', 'Insurance', 'Debt', 'Entertainment',
    'Personal', 'Savings', 'Other'
  ];

  // Fetch expense data when editing and fetch available budgets
  useEffect(() => {
    // Get budgets for the dropdown
    getBudgets();

    // If editing an existing expense, fetch it
    if (expenseId) {
      getExpense(expenseId);
    }

    // Clear expense data when component unmounts
    return () => clearExpense();
  }, [expenseId, getBudgets, getExpense, clearExpense]);

  // Update form data when expense is loaded
  useEffect(() => {
    if (expense && expenseId) {
      setFormData({
        category: expense.category || 'Food',
        amount: expense.amount || '',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: expense.description || '',
        budgetId: expense.budgetId || ''
      });
    }
  }, [expense, expenseId]);

  // Update error state from context
  useEffect(() => {
    if (expenseError) {
      setError(expenseError);
    }
  }, [expenseError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let success;

      if (expenseId) {
        success = await updateExpense(expenseId, formData);
      } else {
        success = await createExpense(formData);
      }

      if (success) {
        // The ExpenseContext has automatically updated the state
        onSave();
      }
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  // Combine loading states
  const isLoading = loading || expenseLoading;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {expenseId ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 text-sm font-medium mb-1">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 text-sm font-medium mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="budgetId" className="block text-gray-700 text-sm font-medium mb-1">
            Link to Budget (Optional)
          </label>
          <select
            id="budgetId"
            name="budgetId"
            value={formData.budgetId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a budget</option>
            {Array.isArray(budgets) && budgets.map(budget => (
              <option key={budget._id} value={budget._id}>
                {budget.name || `${budget.period?.charAt(0).toUpperCase() + budget.period?.slice(1)} Budget`} - ${budget.amount || budget.totalBudget}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;

