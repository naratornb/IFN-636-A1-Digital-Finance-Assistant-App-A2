import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import GoalForm from '../components/Goal/GoalForm';
import GoalList from '../components/Goal/GoalList';
import { useAuth } from '../context/AuthContext';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/goals', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setGoals(response.data);
      } catch (err) {
        setError('Failed to fetch goals');
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) {
      fetchGoals();
    } else {
      setError('You must be logged in to view goals');
      setLoading(false);
    }
  }, [user?.token]);

  const handleSave = () => {
    setEditingGoal(null);
    if (user?.token) {
      setLoading(true);
      axiosInstance.get('/api/goals', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((response) => setGoals(response.data))
        .catch(() => setError('Failed to fetch goals'))
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await axiosInstance.delete(`/api/goals/${goalId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        handleSave();
      } catch (err) {
        setError('Failed to delete goal');
      }
    }
  };



  return (
    <div className="min-h-screen bg-[#4d4d4d] text-white flex flex-col">
      <div className="flex-1 px-6 py-10 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col lg:flex-row flex-wrap gap-5 items-start">
            <div className="flex-1 min-w-[300px] max-w-[500px]">
              <GoalForm
                goals={goals}
                setGoals={setGoals}
                editingGoal={editingGoal}
                setEditingGoal={setEditingGoal}
              />
            </div>
            <div className="flex-1 min-w-[300px]">
              <GoalList
                goals={goals}
                setGoals={setGoals}
                setEditingGoal={setEditingGoal}
                loading={loading}
                error={error}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;

