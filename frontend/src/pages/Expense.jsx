// src/pages/Expenses.js
import React from 'react';
import ExpenseList from '../components/expenses/ExpenseList.jsx';

const Expenses = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExpenseList />
    </div>
  );
};

export default Expenses;