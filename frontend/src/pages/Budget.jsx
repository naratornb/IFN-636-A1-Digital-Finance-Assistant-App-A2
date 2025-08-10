import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';
import { useAuth } from '../context/AuthContext';

const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axiosInstance.get('/api/budgets', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBudgets(response.data);
      } catch (error) {
        alert('Failed to fetch budgets.');
      }
    };

    fetchBudgets();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <BudgetForm
        budgets={budgets}
        setBudgets={setBudgets}
        editingBudget={editingBudget}
        setEditingBudget={setEditingBudget}
      />
      <BudgetList budgets={budgets} setBudgets={setBudgets} setEditingBudget={setEditingBudget} />
    </div>
  );
};

export default Budgets;

