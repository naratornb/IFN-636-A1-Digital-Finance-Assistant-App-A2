import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBudgetContext } from '../../context/BudgetContext';
import { useExpenseContext } from '../../context/ExpenseContext';

const ExpenseForm = ({ editingExpense, setEditingExpense }) => {
  const { user } = useAuth();
  const { budgets, getBudgets } = useBudgetContext();
  const { createExpense, updateExpense } = useExpenseContext();

  const [formData, setFormData] = useState({
    category: 'Other',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    budgetId: ''
  });

  // Categories from the backend model
  const categories = [
    'Housing', 'Transportation', 'Food', 'Utilities',
    'Healthcare', 'Insurance', 'Debt', 'Entertainment',
    'Personal', 'Savings', 'Other'
  ];

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      category: 'Other',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      budgetId: ''
    });
  };

  // Load budgets when component mounts
  useEffect(() => {
    if (user?.token) {
      getBudgets();
    }
  }, [getBudgets, user?.token]);

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        category: editingExpense.category || 'Other',
        amount: editingExpense.amount || '',
        date: editingExpense.date
          ? new Date(editingExpense.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        description: editingExpense.description || '',
        budgetId: editingExpense.budgetId || ''
      });
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      // If budgetId is empty, set to null so it won't be sent as empty string
      if (!expenseData.budgetId) {
        expenseData.budgetId = null;
      }

      let success;

      if (editingExpense) {
        success = await updateExpense(editingExpense._id, expenseData);
      } else {
        success = await createExpense(expenseData);
      }

      if (success) {
        setEditingExpense(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save expense:', error);
      alert('Failed to save expense.');
    }
  };

  const handleCancel = () => {
    setEditingExpense(null);
    resetForm();
  };

  return (
    <section className="bg-[#5a5a5a] border border-[#707070] px-5 py-12 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
      <h1 className="text-3xl font-light uppercase tracking-[0.6em] mb-10">
        {editingExpense ? 'Edit Expense' : 'Create Expense'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid gap-8 md:grid-cols-2">
          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Category
            <select
              value={formData.category}
              onChange={handleChange('category')}
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] text-[#f5f5f5] focus:border-[#f5c400] focus:outline-none"
              required
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-[#5a5a5a]">
                  {category}
                </option>
              ))}
            </select>
          </label>
          
          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Amount
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                <span className="text-[#bfbfbf] text-base">$</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange('amount')}
                className="pl-7 w-full bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </label>

          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Date
            <input
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] text-[#f5f5f5] focus:border-[#f5c400] focus:outline-none"
              required
            />
          </label>

          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Budget (Optional)
            <select
              value={formData.budgetId}
              onChange={handleChange('budgetId')}
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] text-[#f5f5f5] focus:border-[#f5c400] focus:outline-none"
            >
              <option value="" className="bg-[#5a5a5a]">None</option>
              {budgets?.map(budget => (
                <option key={budget._id} value={budget._id} className="bg-[#5a5a5a]">
                  {budget.period} Budget (${budget.totalBudget})
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
          Description
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            rows={4}
            className="bg-transparent border border-[#8c8c8c] px-4 py-4 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none"
            placeholder="Describe this expense"
          />
        </label>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#dfdfdf] border border-[#8c8c8c] transition-colors duration-200 hover:bg-[#707070]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#f5c400] py-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#2d2d2d] shadow-[0_14px_28px_rgba(245,196,0,0.35)] transition-colors duration-200 hover:bg-[#ffd200]"
          >
            {editingExpense ? 'Update Expense' : 'Create Expense'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ExpenseForm;