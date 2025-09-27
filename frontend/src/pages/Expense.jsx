import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { useAuth } from '../context/AuthContext';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.get('/api/expenses', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setExpenses(response.data);
      } catch (error) {
        alert('Failed to fetch expenses.');
      }
    };

    fetchExpenses();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#4d4d4d] text-white flex flex-col">
      <div className="flex-1 px-6 py-10 lg:px-16">
        <div className="mx-auto w-full max-w-20xl">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <ExpenseForm
              expenses={expenses}
              setExpenses={setExpenses}
              editingExpense={editingExpense}
              setEditingExpense={setEditingExpense}
            />
            <ExpenseList
              expenses={expenses}
              setExpenses={setExpenses}
              setEditingExpense={setEditingExpense}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
