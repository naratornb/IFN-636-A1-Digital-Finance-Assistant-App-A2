import { FiEdit2, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

const GoalList = ({ goals, setGoals, setEditingGoal }) => {
  const { user } = useAuth();

  const handleDelete = async (goalId) => {
    try {
      await axiosInstance.delete(`/api/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setGoals(goals.filter((goal) => goal._id !== goalId));
    } catch (error) {
      alert('Failed to delete goal.');
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    return status === 'active'
      ? 'bg-green-800 text-green-100'
      : 'bg-red-800 text-red-100';
  };

  return (
    <section className="bg-[#3f3f3f] border border-[#5c5c5c] px-8 py-10 shadow-[0_18px_36px_rgba(0,0,0,0.35)] w-full">
      <h2 className="mb-8 text-lg font-semibold uppercase tracking-[0.4em] text-[#f0f0f0]">
        Goal List
      </h2>
      {goals.length === 0 ? (
        <div className="bg-[#4a4a4a] rounded-lg p-8 text-center w-full">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#5a5a5a] mb-4">
            <svg className="h-6 w-6 text-[#f5c400]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#f0f0f0] mb-2">No goals found</h3>
          <p className="text-[#cfcfcf] mb-4">Create your first goal to start tracking your savings.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          {/* Header row */}
          <div className="hidden text-xs uppercase tracking-[0.25em] text-[#cfcfcf] md:grid md:grid-cols-[180px_160px_120px_80px_50px] md:gap-3 md:border-b md:border-[#5c5c5c] md:pb-4 w-full">
            <span className="text-left">Name</span>
            <span className="text-left">Current / Goal</span>
            <span className="text-left">Deadline</span>
            <span className="text-left">Status</span>
            <span className="text-left">Action</span>
          </div>
          {/* Goal items */}
          <div className="mt-6 space-y-6 w-full">
            {goals.map((goal) => (
              <div
                key={goal._id}
                className="grid items-center gap-3 text-xs text-[#f5f5f5] md:grid-cols-[180px_160px_120px_80px_50px] w-full"
              >
                {/* Name column */}
                <div className="text-left font-medium uppercase tracking-[0.2em] break-words whitespace-normal">
                  <span>{goal.name}</span>
                </div>
                {/* Current / Goal column */}
                <div className="text-left break-words whitespace-normal max-w-[120px]">
                  <span className="text-[#cfcfcf] mr-1">$</span>
                  <span>{parseFloat(goal.current || 0).toFixed(2)}</span>
                  <span className="mx-2 text-[#999]">/</span>
                  <span className="text-[#cfcfcf] mr-1">$</span>
                  <span>{parseFloat(goal.target || 0).toFixed(2)}</span>
                </div>
                {/* Deadline column */}
                <div className="text-left break-words whitespace-normal max-w-[120px]">
                  <div className="flex items-center">
                    <FiCalendar className="inline-block w-4 h-4 mr-2" />
                    {formatDateForDisplay(goal.deadline)}
                  </div>
                  <div className="flex items-center text-[#a0a0a0] mt-1">
                    <FiClock className="inline-block w-3 h-3 mr-1" />
                    <span className="text-xs">{goal.daysRemaining} days left</span>
                  </div>
                </div>
                {/* Status column */}
                <div className="text-left break-words whitespace-normal">
                  <span className={`px-2 py-1 rounded text-xs uppercase font-semibold ${getStatusBadgeClass(goal.status)}`}>
                    {goal.status}
                  </span>
                </div>
                {/* Actions column */}
                <div className="flex items-center gap-0 text-left">
                  <button
                    type="button"
                    onClick={() => setEditingGoal(goal)}
                    className="rounded-full border border-transparent p-2 text-[#f5c400] transition-colors duration-200 hover:border-[#f5c400] hover:text-[#ffd200]"
                    aria-label={`Edit ${goal.name} goal`}
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(goal._id)}
                    className="rounded-full border border-transparent p-2 text-[#ff6b6b] transition-colors duration-200 hover:border-[#ff6b6b] hover:text-[#ff8787]"
                    aria-label={`Delete ${goal.name} goal`}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default GoalList;
