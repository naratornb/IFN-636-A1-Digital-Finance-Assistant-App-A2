import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import GoalForm from '../components/GoalForm';
import GoalList from '../components/GoalList';
import { useAuth } from '../context/AuthContext';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axiosInstance.get('/api/goals', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setGoals(response.data);
      } catch (error) {
        alert('Failed to fetch goals.');
      }
    };

    fetchGoals();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <GoalForm
        goals={goals}
        setGoals={setGoals}
        editingGoal={editingGoal}
        setEditingGoal={setEditingGoal}
      />
      <GoalList goals={goals} setGoals={setGoals} setEditingGoal={setEditingGoal} />
    </div>
  );
};

export default Goals;

