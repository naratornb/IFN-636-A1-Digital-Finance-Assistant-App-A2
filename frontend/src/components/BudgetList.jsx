import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BudgetList = ({ budgets, setBudgets, setEditingBudget }) => {
  const { user } = useAuth();

  const handleDelete = async (budgetId) => {
    try {
      await axiosInstance.delete(`/api/budgets/${budgetId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBudgets(budgets.filter((budget) => budget._id !== budgetId));
    } catch (error) {
      alert('Failed to delete budget.');
    }
  };

  return (
    <div>
      {budgets.map((budget) => (
        <div key={budget._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{budget.name}</h2>
          <p>Current Amount: ${budget.saved}</p>
          <p>Target Amount: ${budget.amount}</p>
          <p className="text-sm text-gray-500">Target Date: {new Date(budget.deadline).toLocaleDateString()}</p>
          <p>Status: {budget.status}</p>
          <p>Remark: {budget.description}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingBudget(budget)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(budget._id)}
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

export default BudgetList;
