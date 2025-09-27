// src/components/expenses/ExpenseCard.js
import React from 'react';
import { useExpenseContext } from '../../context/ExpenseContext';

const ExpenseCard = ({ expense, onEdit }) => {
  const { deleteExpense } = useExpenseContext();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const success = await deleteExpense(expense._id);
        if (success) {
          // The ExpenseContext will automatically update the UI
          // No need for manual refresh
        }
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Housing': 'bg-blue-100 text-blue-800',
      'Transportation': 'bg-yellow-100 text-yellow-800',
      'Food': 'bg-green-100 text-green-800',
      'Utilities': 'bg-purple-100 text-purple-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Insurance': 'bg-indigo-100 text-indigo-800',
      'Debt': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-orange-100 text-orange-800',
      'Personal': 'bg-teal-100 text-teal-800',
      'Savings': 'bg-cyan-100 text-cyan-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{expense.description || 'No description'}</h3>
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getCategoryColor(expense.category)}`}>
              {expense.category}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">${expense.amount.toFixed(2)}</div>
            <div className="text-sm text-gray-500">{formatDate(expense.date)}</div>
          </div>
        </div>

        {expense.budgetId && (
          <div className="text-sm text-gray-600 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Linked to Budget
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => onEdit(expense._id)}
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

export default ExpenseCard;