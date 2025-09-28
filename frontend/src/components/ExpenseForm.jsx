import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ExpenseForm = ({
  expenses,
  setExpenses,
  editingExpense,
  setEditingExpense,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    deadline: '',
    paymentMethod: '',
    description: '',
  });

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      deadline: '',
      paymentMethod: '',
      description: '',
    });
  };

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        name: editingExpense.name,
        amount: editingExpense.amount,
        deadline: editingExpense.deadline,
        paymentMethod: editingExpense.paymentMethod || '',
        description: editingExpense.description || '',
      });
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingExpense) {
        const { data } = await axiosInstance.put(
          `/api/expenses/${editingExpense._id}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } },
        );
        setExpenses(
          expenses.map((expense) =>
            expense._id === data._id ? data : expense,
          ),
        );
      } else {
        const { data } = await axiosInstance.post('/api/expenses', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setExpenses([...expenses, data]);
      }
      setEditingExpense(null);
      resetForm();
    } catch (error) {
      alert('Failed to save expense.');
    }
  };

  const handleCancel = () => {
    setEditingExpense(null);
    resetForm();
  };

  return (
    <section className="bg-[#5a5a5a] border border-[#707070] px-5 py-12 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
      <h1 className="text-3xl font-light uppercase tracking-[0.6em] mb-10">
        {editingExpense ? 'Edit Expense' : 'Create Expense'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid gap-8 md:grid-cols-2">
          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Name
            <input
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none"
              placeholder=" "
              required
            />
          </label>

          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Category
            <input
              type="text"
              value={formData.category}
              onChange={handleChange('category')}
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none"
              placeholder=" "
            />
          </label>
          
          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange('amount')}
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none"
              placeholder="$ 0.00"
              required
            />
          </label>

          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Date
            <input
              type="date"
              value={formData.deadline}
              onChange={handleChange('deadline')}
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] text-[#f5f5f5] focus:border-[#f5c400] focus:outline-none"
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
          Description
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            rows={4}
            className="bg-transparent border border-[#8c8c8c] px-4 py-4 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none"
            placeholder="Describe this expense"
          />
        </label>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#dfdfdf] border border-[#8c8c8c] transition-colors duration-200 hover:bg-[#707070]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#f5c400] py-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#2d2d2d] shadow-[0_14px_28px_rgba(245,196,0,0.35)] transition-colors duration-200 hover:bg-[#ffd200]"
          >
            {editingExpense ? 'Update Expense' : 'Create Expense'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ExpenseForm;