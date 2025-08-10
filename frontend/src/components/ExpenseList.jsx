import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ExpenseList = ({ expenses, setExpenses, setEditingExpense }) => {
  const { user } = useAuth();

  const handleDelete = async (expenseId) => {
    try {
      await axiosInstance.delete(`/api/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
    } catch (error) {
      alert('Failed to delete expense.');
    }
  };

  return (
    <div>
      {expenses.map((expense) => (
        <div key={expense._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{expense.name}</h2>
          
          <p className="text-sm text-gray-500">Mark Date {new Date(expense.deadline).toLocaleDateString()}</p>
          <p>Total Amount: ${expense.amount}</p>
          <p>Payment Method: {expense.paymentMethod || 'N/A'}</p>  
          <div className="mt-2">
            <button
              onClick={() => setEditingExpense(expense)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(expense._id)}
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

export default ExpenseList;
