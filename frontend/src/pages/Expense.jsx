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
    <div className="container mx-auto p-6">
      <ExpenseForm
        expenses={expenses}
        setExpenses={setExpenses}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
      />
      <ExpenseList expenses={expenses} setExpenses={setExpenses} setEditingExpense={setEditingExpense} />
    </div>
  );
};

export default Expenses;

