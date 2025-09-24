// src/components/budgets/BudgetForm.js
import React, { useState, useEffect } from 'react';
import BudgetService from '../../services/BudgetService.jsx';
import { useAuth } from '../../context/AuthContext';

const BudgetForm = ({ budgetId, onSave, onCancel }) => {
  const { user } = useAuth(); // Get user from AuthContext
  const [formData, setFormData] = useState({
    period: 'monthly',
    totalBudget: '',
    startDate: new Date().toISOString().split('T')[0], // Default to today's date
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (budgetId && user?.token) {
      const fetchBudget = async () => {
        try {
          const response = await BudgetService.getBudgetById(user.token, budgetId);
          const budget = response.data;
          setFormData({
            period: budget.period,
            totalBudget: budget.totalBudget,
            startDate: budget.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            notes: budget.notes || ''
          });
        } catch (err) {
          setError('Failed to fetch budget data');
        }
      };
      fetchBudget();
    }
  }, [budgetId, user?.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user?.token) {
        throw new Error('You must be logged in to perform this action');
      }

      // Ensure totalBudget is a number
      const budgetData = {
        ...formData,
        totalBudget: parseFloat(formData.totalBudget)
      };

      if (budgetId) {
        await BudgetService.updateBudget(user.token, budgetId, budgetData);
      } else {
        await BudgetService.createBudget(user.token, budgetData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {budgetId ? 'Edit Budget' : 'Create New Budget'}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="period" className="block text-gray-700 text-sm font-medium mb-1">
            Period
          </label>
          <select
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            disabled={budgetId}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            required
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-700 text-sm font-medium mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="totalBudget" className="block text-gray-700 text-sm font-medium mb-1">
            Total Budget
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="totalBudget"
              name="totalBudget"
              value={formData.totalBudget}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="notes" className="block text-gray-700 text-sm font-medium mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
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
            disabled={loading}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;