import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

const GoalForm = ({ goals, setGoals, editingGoal, setEditingGoal }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    deadline: '',
    target: '',
    current: '',
    description: ''
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        name: editingGoal.name || '',
        deadline: editingGoal.deadline || '',
        target: editingGoal.target || '',
        current: editingGoal.current || '',
        description: editingGoal.description || ''
      });
    } else {
      setFormData({ name: '', deadline: '', target: '', current: '', description: '' });
    }
  }, [editingGoal]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      setFormData({ name: '', deadline: '', target: '', current: '', description: '' });
    } catch (error) {
      alert('Failed to save goal.');
    }
  };

  return (
    <section className="bg-[#5a5a5a] border border-[#707070] px-5 py-12 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
      <h1 className="text-3xl font-light uppercase tracking-[0.6em] mb-10">
        {editingGoal ? 'Edit Goal' : 'Create Goal'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid gap-8 md:grid-cols-2">
          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Name
            <input
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] text-[#f5f5f5] focus:border-[#f5c400] focus:outline-none"
              placeholder="Goal Name"
              required
            />
          </label>
          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Deadline
            <input
              type="date"
              value={formData.deadline}
              onChange={handleChange('deadline')}
              className="bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] text-[#f5f5f5] focus:border-[#f5c400] focus:outline-none"
              required
            />
          </label>
          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Target
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                <span className="text-[#bfbfbf] text-base">$</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.target}
                onChange={handleChange('target')}
                className="pl-7 w-full bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </label>
          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Current
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                <span className="text-[#bfbfbf] text-base">$</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.current}
                onChange={handleChange('current')}
                className="pl-7 w-full bg-transparent border-b border-[#8c8c8c] px-1 py-2 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </label>
        </div>
        <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
          Description
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            rows={4}
            className="bg-transparent border border-[#8c8c8c] px-4 py-4 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none"
            placeholder="Describe this goal"
          />
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => { setEditingGoal(null); setFormData({ name: '', deadline: '', target: '', current: '', description: '' }); }}
            className="flex-1 py-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#dfdfdf] border border-[#8c8c8c] transition-colors duration-200 hover:bg-[#707070]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#f5c400] py-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#2d2d2d] shadow-[0_14px_28px_rgba(245,196,0,0.35)] transition-colors duration-200 hover:bg-[#ffd200]"
          >
            {editingGoal ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default GoalForm;
