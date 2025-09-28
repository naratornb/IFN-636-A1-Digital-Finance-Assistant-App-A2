// src/pages/Expenses.js
import React, { useState } from 'react';
import ExpenseList from '../components/expenses/ExpenseList.jsx';
import ExpenseForm from '../components/expenses/ExpenseForm.jsx';
import { useExpenseContext } from '../context/ExpenseContext';

const Expenses = () => {
  const { expenses } = useExpenseContext();
  const [editingExpense, setEditingExpense] = useState(null);

  return (
    <div className="min-h-screen bg-[#4d4d4d] text-white flex flex-col">
      <div className="flex-1 px-6 py-10 lg:px-16">
        <div className="mx-auto w-full max-w-20xl">
          <div className="flex flex-nowrap gap-5">
            {/* Expense Form - Fixed 40% width */}
            <div className="w-full lg:w-[45%]">
              <ExpenseForm
                editingExpense={editingExpense}
                setEditingExpense={setEditingExpense}
              />
            </div>

            {/* Expense List - Flexible remaining space */}
            <div className="w-full lg:w-[55%]">
              <ExpenseList
                setEditingExpense={setEditingExpense}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
