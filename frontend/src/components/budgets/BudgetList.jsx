// src/components/budgets/BudgetList.js
import React, { useState, useEffect } from 'react';
import BudgetCard from './BudgetCard.jsx';
import BudgetForm from './BudgetForm.jsx';
import { useBudgetContext } from '../../context/BudgetContext';

const BudgetList = () => {
  const { budgets, isLoading, error, getBudgets, resetSuccess } = useBudgetContext();
  const [showForm, setShowForm] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState(null);

  // Fetch budgets when component mounts
  useEffect(() => {
    getBudgets();
    // Clean up success state when component unmounts
    return () => resetSuccess();
  }, [getBudgets, resetSuccess]);

  const handleSave = () => {
    // Close the form after save
    setShowForm(false);
    setEditingBudgetId(null);
    // No need to manually refresh - context handles state update
  };

  const handleEdit = (budgetId) => {
    setEditingBudgetId(budgetId);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBudgetId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Budget Planning</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          {showForm ? 'Cancel' : 'Create New Budget'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <BudgetForm
          budgetId={editingBudgetId}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : Array.isArray(budgets) && budgets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets found</h3>
          <p className="text-gray-500 mb-4">Create your first budget to start tracking your finances.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(budgets) && budgets.map(budget => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetList;

