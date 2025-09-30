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
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        name: editingGoal.name || '',
        deadline: editingGoal.deadline ? new Date(editingGoal.deadline).toISOString().split('T')[0] : '',
        target: editingGoal.target || '',
        current: editingGoal.current || '',
        description: editingGoal.description || ''
      });
    } else {
      setFormData({ name: '', deadline: '', target: '', current: '', description: '' });
    }
    // Clear errors when form changes
    setErrors({});
    setGeneralError('');
  }, [editingGoal]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user makes changes
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setGeneralError('');

    try {
      if (editingGoal) {
        const response = await axiosInstance.put(`/api/goals/${editingGoal._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setGoals(goals.map((goal) => (goal._id === response.data._id ? response.data : goal)));
        setEditingGoal(null);
        setFormData({ name: '', deadline: '', target: '', current: '', description: '' });
      } else {
        const response = await axiosInstance.post('/api/goals', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setGoals([...goals, response.data]);
        setFormData({ name: '', deadline: '', target: '', current: '', description: '' });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const responseData = error.response.data;

        // Handle validation errors
        if (responseData.errors) {
          setErrors(responseData.errors);
        }

        // Handle general error message
        if (responseData.message) {
          setGeneralError(responseData.message);
        } else {
          setGeneralError('Failed to save goal. Please try again.');
        }
      } else {
        setGeneralError('An unexpected error occurred. Please try again.');
      }
    }
  };

  // Helper function to render error message
  const renderError = (field) => {
    return errors[field] ? (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <section className="bg-[#5a5a5a] border border-[#707070] px-5 py-12 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
      <h1 className="text-3xl font-light uppercase tracking-[0.6em] mb-10">
        {editingGoal ? 'Edit Goal' : 'Create Goal'}
      </h1>

      {generalError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <span className="block sm:inline">{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid gap-8 md:grid-cols-2">
          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Name
            <input
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              className={`bg-transparent border-b ${errors.name ? 'border-red-500' : 'border-[#8c8c8c]'} px-1 py-2 text-base tracking-[0.1em] text-[#f5f5f5] focus:border-[#f5c400] focus:outline-none`}
              placeholder="Goal Name"
              required
            />
            {renderError('name')}
          </label>
          <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
            Deadline
            <input
              type="date"
              value={formData.deadline}
              onChange={handleChange('deadline')}
              className={`bg-transparent border-b ${errors.deadline ? 'border-red-500' : 'border-[#8c8c8c]'} px-1 py-2 text-base tracking-[0.1em] text-[#f5f5f5] focus:border-[#f5c400] focus:outline-none`}
              required
            />
            {renderError('deadline')}
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
                className={`pl-7 w-full bg-transparent border-b ${errors.target ? 'border-red-500' : 'border-[#8c8c8c]'} px-1 py-2 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none`}
                placeholder="0.00"
                required
              />
              {renderError('target')}
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
                className={`pl-7 w-full bg-transparent border-b ${errors.current ? 'border-red-500' : 'border-[#8c8c8c]'} px-1 py-2 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none`}
                placeholder="0.00"
              />
              {renderError('current')}
            </div>
          </label>
        </div>
        <label className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#dfdfdf]">
          Description
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            rows={4}
            className={`bg-transparent border ${errors.description ? 'border-red-500' : 'border-[#8c8c8c]'} px-4 py-4 text-base tracking-[0.1em] placeholder:text-[#bfbfbf] focus:border-[#f5c400] focus:outline-none`}
            placeholder="Describe this goal"
          />
          {renderError('description')}
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
