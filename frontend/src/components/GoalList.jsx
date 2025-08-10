import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

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

  return (
    <div>
      {goals.map((goal) => (
        <div key={goal._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{goal.name}</h2>
          <p>Saving Amount: ${goal.amount}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingGoal(goal)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(goal._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalList;

