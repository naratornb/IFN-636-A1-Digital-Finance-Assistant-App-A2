// src/components/expenses/ExpenseList.js
import React, { useState, useEffect } from 'react';
import ExpenseCard from './ExpenseCard.jsx';
import ExpenseForm from './ExpenseForm.jsx';
import { useExpenseContext } from '../../context/ExpenseContext';

const ExpenseList = () => {
  const { expenses, isLoading, error, getExpenses, resetSuccess } = useExpenseContext();
  const [showForm, setShowForm] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Fetch expenses when component mounts
    getExpenses();

    // Clean up success state when component unmounts
    return () => resetSuccess();
  }, [getExpenses, resetSuccess]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    getExpenses(params);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingExpenseId(null);
    // No need to manually refresh - ExpenseContext handles state updates
    // We'll still apply any active filters to keep the view consistent
    handleApplyFilters();
  };

  const handleEdit = (expenseId) => {
    setEditingExpenseId(expenseId);
    setShowForm(true);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      startDate: '',
      endDate: ''
    });
    getExpenses(); // Get all expenses without filters
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExpenseId(null);
  };

  const categories = [
    'Housing', 'Transportation', 'Food', 'Utilities',
    'Healthcare', 'Insurance', 'Debt', 'Entertainment',
    'Personal', 'Savings', 'Other'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Expenses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {showForm && (
        <ExpenseForm
          expenseId={editingExpenseId}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Filter Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading expenses...</p>
        </div>
      ) : Array.isArray(expenses) && expenses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenses.map(expense => (
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No expenses found.</p>
          <p className="text-gray-500 mt-1">
            {Object.values(filters).some(Boolean) ? 'Try changing your filters.' : 'Add your first expense to get started.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;