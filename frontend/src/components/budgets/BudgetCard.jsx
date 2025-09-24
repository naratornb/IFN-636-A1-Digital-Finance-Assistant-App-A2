// src/components/budgets/BudgetCard.js
import React from 'react';
import BudgetService from '../../services/BudgetService.jsx';
import { useAuth } from '../../context/AuthContext';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { user } = useAuth(); // Get user from AuthContext

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        if (!user?.token) {
          throw new Error('You must be logged in to perform this action');
        }
        await BudgetService.deleteBudget(user.token, budget._id);
        onDelete();
      } catch (err) {
        alert(err.message || 'Failed to delete budget');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
          </h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            budget.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {budget.status}
          </span>
        </div>

        <div className="flex items-baseline mb-4">
          <span className="text-gray-500 mr-1">$</span>
          <span className="text-2xl font-bold text-gray-900">{budget.totalBudget.toFixed(2)}</span>
        </div>

        <div className="text-sm text-gray-600 mb-3">
          <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
        </div>

        {budget.notes && (
          <div className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-md">
            {budget.notes}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => onEdit(budget._id)}
            className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;