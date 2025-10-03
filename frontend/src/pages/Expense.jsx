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
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col lg:flex-row flex-wrap gap-5 items-start">
            <div className="flex-1 min-w-[300px] max-w-[500px]">
              <ExpenseForm
                editingExpense={editingExpense}
                setEditingExpense={setEditingExpense}
              />
            </div>
            <div className="flex-1 min-w-[300px]">
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
