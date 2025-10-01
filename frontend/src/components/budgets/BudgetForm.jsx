import React, { useState, useEffect } from 'react';
import { useBudgetContext } from '../../context/BudgetContext';
import { useAuth } from '../../context/AuthContext';
import BudgetService from '../../services/BudgetService';

const BudgetForm = ({ budgetId, onSave, onCancel }) => {
  const { user } = useAuth();
  const {
    budget,
    getBudget,
    createBudget,
    updateBudget,
    clearBudget,
    error: contextError
  } = useBudgetContext();

  const [formData, setFormData] = useState({
    period: 'monthly',
    totalBudget: '',
    startDate: new Date().toISOString().split('T')[0], 
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      period: 'monthly',
      totalBudget: '',
      startDate: new Date().toISOString().split('T')[0], 
      notes: ''
    });
    setError('');
  };

  useEffect(() => {
    if (budgetId && user?.token) {
      const fetchBudget = async () => {
        try {
          const response = await BudgetService.getBudgetById(user.token, budgetId);
          const budget = response.data || response;

          
          const startDateStr = budget.startDate
            ? new Date(budget.startDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];

          setFormData({
            period: budget.period || 'monthly',
            totalBudget: budget.totalBudget || '',
            startDate: startDateStr,
            notes: budget.notes || ''
          });
        } catch (err) {
          setError('Failed to fetch budget data');
          console.error('Error fetching budget:', err);
        }
      };
      fetchBudget();
    } else {
      // Reset form when budgetId is null (creating new budget)
      resetForm();
    }

    // Clear budget data when component unmounts
    return () => clearBudget();
  }, [budgetId, user?.token, clearBudget]);

  // Update form when budget data is loaded
  useEffect(() => {
    if (budget && budgetId) {
      // Format the date properly from the budget context data
      const startDateStr = budget.startDate
        ? new Date(budget.startDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      setFormData({
        period: budget.period || 'monthly',
        totalBudget: budget.totalBudget || '',
        startDate: startDateStr,
        notes: budget.notes || ''
      });
    }
  }, [budget, budgetId]);

  // Update error state from context
  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

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

      const budgetData = {
        ...formData,
        totalBudget: parseFloat(formData.totalBudget)
      };

      let success;

      if (budgetId) {
        success = await updateBudget(budgetId, budgetData);
      } else {
        success = await createBudget(budgetData);
      }

      if (success) {
        // State is automatically updated via context
        onSave();
      }
    } catch (err) {
      setError(err.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <section className="bg-[#5a5a5a] border border-[#707070] px-5 py-12 shadow-[0_18px_36px_rgba(0,0,0,0.35)] w-full max-w-full">
      <h1 className="text-3xl font-light uppercase tracking-[0.6em] mb-10">
        {budgetId ? 'Edit Budget' : 'Create Budget'}
      </h1>

      {error && (
        <div className="bg-red-900 bg-opacity-30 text-red-400 p-3 rounded-md mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10 w-full">
        <div className="grid gap-8 md:grid-cols-2 w-full">
          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Period
            <select
              name="period"
              value={formData.period}
              onChange={handleChange}
              disabled={budgetId}
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] text-[#f5f5f5] focus:border-[#f5c400] focus:outline-none disabled:opacity-50 w-full"
              required
            >
              <option value="weekly" className="bg-[#5a5a5a]">Weekly</option>
              <option value="monthly" className="bg-[#5a5a5a]">Monthly</option>
            </select>
          </label>

          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Start Date
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] text-[#f5f5f5] focus:border-[#f5c400] focus:outline-none w-full"
            />
          </label>

          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Total Budget
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                <span className="text-[#bfbfbf] text-base">$</span>
              </div>
              <input
                type="number"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="pl-7 w-full bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </label>

          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Status
            <input
              type="text"
              value={budgetId ? 'Active' : 'New'}
              disabled
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] text-[#f5f5f5] focus:border-[#f5c400] focus:outline-none disabled:opacity-50 w-full"
              readOnly
            />
          </label>
        </div>

        <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
          Notes
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="bg-transparent border border-[#8c8c8c] px-4 py-4 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none w-full"
            placeholder="Add any notes about this budget"
          />
        </label>

        <div className="flex gap-4 w-full">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#dfdfdf] border border-[#8c8c8c] transition-colors duration-200 hover:bg-[#707070]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#f5c400] py-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#2d2d2d] shadow-[0_14px_28px_rgba(245,196,0,0.35)] transition-colors duration-200 hover:bg-[#ffd200] disabled:opacity-50"
          >
            {loading ? 'Saving...' : (budgetId ? 'Update Budget' : 'Create Budget')}
          </button>
        </div>
      </form>
    </section>
  );
};

export default BudgetForm;