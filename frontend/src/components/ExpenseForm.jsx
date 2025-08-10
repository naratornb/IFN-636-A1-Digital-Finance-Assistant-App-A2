import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ExpenseForm = ({ expenses, setExpenses, editingExpense, setEditingExpense }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({  
    name: '',
    amount: '',
    deadline: '',
    paymentMethod: '',
    description: '' 
  });

    useEffect(() => {
      if (editingExpense) {
        setFormData({
          name: editingExpense.name,
          amount: editingExpense.amount,
          deadline: editingExpense.deadline,
          paymentMethod: editingExpense.paymentMethod || '',
          description: editingExpense.description || ''
        });
      } else {
        setFormData({
          name: '',
          amount: '',
          deadline: '',
          paymentMethod: '',
          description: ''
        });
      }
    }, [editingExpense]);
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        const response = await axiosInstance.put(`/api/expenses/${editingExpense._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setExpenses(expenses.map((expense) => (expense._id === response.data._id ? response.data : expense)));
      } else {
        const response = await axiosInstance.post('/api/expenses', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setExpenses([...expenses, response.data]);
      }
      setEditingExpense(null);
      setFormData({ name: '', amount: '', deadline: '', paymentMethod: '', description: '' });
    } catch (error) {
      alert('Failed to save expense.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingExpense ? 'Edit Expense' : 'Add Expense'}</h1>
      <input
        type="text"
        placeholder="Category or Type"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      
      <input
        type="Date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Total Expense ($Amount)"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <select
        value={formData.paymentMethod}
        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select Payment Method</option>
        <option value="cash">Cash</option>
        <option value="credit_card">Credit Card</option>
        <option value="debit_card">Debit Card</option>
        <option value="bank_transfer">Bank Transfer</option>
        <option value="other">Other</option>
      </select>

      <input
        type="text"
        placeholder="Report Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 py-10 px-2 border rounded"
        
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingExpense ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
