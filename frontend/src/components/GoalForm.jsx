import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const GoalForm = ({ goals, setGoals, editingGoal, setEditingGoal }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', amount: '', deadline: '' });

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        name: editingGoal.name,
        amount: editingGoal.amount,
        deadline: editingGoal.deadline,
      });
    } else {
      setFormData({ name: '', amount: '', deadline: '' });
    }
  }, [editingGoal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        const response = await axiosInstance.put(`/api/goals/${editingGoal._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setGoals(goals.map((goal) => (goal._id === response.data._id ? response.data : goal)));
      } else {
        const response = await axiosInstance.post('/api/goals', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setGoals([...goals, response.data]);
      }
      setEditingGoal(null);
      setFormData({ name: '', amount: '', deadline: '' });
    } catch (error) {
      alert('Failed to save goal.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingGoal ? 'Edit Goal' : 'Add Goal'}</h1>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Saving Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingGoal ? 'Update Goal' : 'Add Goal'}
      </button>
    </form>
  );
};

export default GoalForm;
