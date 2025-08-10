import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BudgetForm = ({ budgets, setBudgets, editingBudget, setEditingBudget }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', saved: '', amount: '', deadline: '', status: '', description: '' });

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        name: editingBudget.name,
        saved: editingBudget.saved,
        amount: editingBudget.amount,
        deadline: editingBudget.deadline,
        status: editingBudget.status,
        description: editingBudget.description,
      });
    } else {
      setFormData({ name: '', saved: '', amount: '', deadline: '', status: '', description: '' });
    }
  }, [editingBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        const response = await axiosInstance.put(`/api/budgets/${editingBudget._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBudgets(budgets.map((budget) => (budget._id === response.data._id ? response.data : budget)));
      } else {
        const response = await axiosInstance.post('/api/budgets', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBudgets([...budgets, response.data]);
      }
      setEditingBudget(null);
      setFormData({ name: '', saved: '', amount: '', deadline: '', status: '',  description: ''});
    } catch (error) {
      alert('Failed to save budget.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingBudget ? 'Edit Budget' : 'Add Budget'}</h1>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Current Saved"
        value={formData.saved}
        onChange={(e) => setFormData({ ...formData, saved: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Target Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <p>Target Date</p>
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select Status</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <input
        type="text"
        placeholder="Note "
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 py-10 px-2 border rounded"
        
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingBudget ? 'Update Budget' : 'Add Budget'}
      </button>
    </form>
  );
};

export default BudgetForm;
