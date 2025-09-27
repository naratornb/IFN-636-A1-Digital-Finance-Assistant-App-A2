import { FiEdit2, FiTrash2 } from 'react-icons/fi';
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
    <section className="bg-[#3f3f3f] border border-[#5c5c5c] px-8 py-10 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
      <h2 className="mb-8 text-lg font-semibold uppercase tracking-[0.4em] text-[#f0f0f0]">
        History
      </h2>
      <div className="overflow-x-auto">
        <div className="hidden text-xs uppercase tracking-[0.25em] text-[#cfcfcf] md:grid md:grid-cols-[minmax(140px,1fr)_minmax(100px,1fr)_minmax(140px,1fr)_minmax(120px,0.8fr)_0.6fr] md:gap-6 md:border-b md:border-[#5c5c5c] md:pb-4">
          <span className="text-left">Name</span>
          <span className="text-left">Amount</span>
          <span className="text-left">Category</span>
          <span className="text-left">Date</span>
          <span className="text-left">Action</span>
        </div>

        <div className="mt-6 space-y-6">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="grid items-center gap-4 text-xs text-[#f5f5f5] md:grid-cols-[minmax(140px,1fr)_minmax(100px,1fr)_minmax(140px,1fr)_minmax(120px,0.8fr)_0.6fr]"
            >
              <span className="text-left font-medium uppercase tracking-[0.2em] break-words whitespace-normal">
                {expense.name}
              </span>
              <span className="text-left break-words whitespace-normal max-w-[120px]">
                ${expense.amount}
              </span>
              <span className="text-left uppercase tracking-[0.15em] break-words whitespace-normal max-w-[140px]">
                {expense.paymentMethod || '—'}
              </span>
              <span className="text-left">
                {expense.deadline
                  ? new Date(expense.deadline).toLocaleDateString()
                  : '—'}
              </span>
              <div className="flex items-center gap-0 text-left">
                <button
                  type="button"
                  onClick={() => setEditingExpense(expense)}
                  className="rounded-full border border-transparent p-2 text-[#f5c400] transition-colors duration-200 hover:border-[#f5c400] hover:text-[#ffd200]"
                  aria-label={`Edit ${expense.name}`}
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(expense._id)}
                  className="rounded-full border border-transparent p-2 text-[#ff6b6b] transition-colors duration-200 hover:border-[#ff6b6b] hover:text-[#ff8787]"
                  aria-label={`Delete ${expense.name}`}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpenseList; 