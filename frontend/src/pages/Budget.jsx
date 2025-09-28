import React, { useState, useEffect, useCallback } from 'react';
import BudgetForm from "../components/budgets/BudgetForm";
import BudgetList from "../components/budgets/BudgetList";
import { useAuth } from '../context/AuthContext';
import BudgetService from '../services/BudgetService';

const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await BudgetService.getBudgets(user.token);
      setBudgets(response.data);
    } catch (err) {
      setError('Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    if (user?.token) {
      fetchBudgets();
    } else {
      setError('You must be logged in to view budgets');
      setLoading(false);
    }
  }, [user?.token, fetchBudgets]); // ✅ no ESLint warning

  const handleSave = () => {
    setEditingBudget(null);
    fetchBudgets();
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await BudgetService.deleteBudget(user.token, budgetId);
        fetchBudgets();
      } catch (err) {
        setError('Failed to delete budget');
      }
    }
  };

  const handleCancel = () => {
    setEditingBudget(null);
  };

  return (
    <div className="min-h-screen bg-[#4d4d4d] text-white flex flex-col">
      <div className="flex-1 px-6 py-10 lg:px-16">
        <div className="mx-auto w-full max-w-20xl">
          <div className="flex flex-nowrap gap-5">
            {/* Budget Form - Fixed 45% width */}
            <div className="w-full lg:w-[45%] shrink-0">
              <BudgetForm
                budgetId={editingBudget?._id}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>

            {/* Budget List - Flexible 55% width */}
            <div className="w-full lg:w-[55%] min-h-[600px] overflow-x-auto">
              <BudgetList
                budgets={budgets}
                setBudgets={setBudgets}
                editingBudget={editingBudget}
                setEditingBudget={setEditingBudget}
                loading={loading}
                error={error}
                fetchBudgets={fetchBudgets}
                handleDelete={handleDelete}
                showHeader={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
