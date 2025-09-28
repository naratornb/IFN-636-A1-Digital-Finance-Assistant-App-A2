import { useEffect } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useExpenseContext } from '../../context/ExpenseContext';

const ExpenseList = ({ setEditingExpense }) => {
  const { user } = useAuth();
  const { expenses, deleteExpense, getExpenses } = useExpenseContext();

  // Fetch expenses when component mounts
  useEffect(() => {
    if (user?.token) {
      getExpenses();
    }
  }, [getExpenses, user?.token]);

  const handleDelete = async (expenseId) => {
    const confirmed = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;

    try {
      await deleteExpense(expenseId);
      // No need to manually update state - the context handles it
    } catch (error) {
      alert('Failed to delete expense.');
    }
  };

  // Helper function to safely format currency
  const formatCurrency = (amount) => {
    // Check if amount exists and is a number
    if (amount === undefined || amount === null) {
      return '$0.00';
    }

    // Convert to number if it's a string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Check if it's a valid number
    if (isNaN(numAmount)) {
      return '$0.00';
    }

    return `$${numAmount.toFixed(2)}`;
  };

  return (
    <section className="bg-[#3f3f3f] border border-[#5c5c5c] px-8 py-10 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
      <h2 className="mb-8 text-lg font-semibold uppercase tracking-[0.4em] text-[#f0f0f0]">
        History
      </h2>
      <div className="overflow-x-auto">
        <div className="hidden text-xs uppercase tracking-[0.25em] text-[#cfcfcf] md:grid md:grid-cols-[minmax(140px,1fr)_minmax(100px,1fr)_minmax(140px,1fr)_minmax(120px,0.8fr)_0.6fr] md:gap-6 md:border-b md:border-[#5c5c5c] md:pb-4">
          <span className="text-left">Description</span>
          <span className="text-left">Amount</span>
          <span className="text-left">Category</span>
          <span className="text-left">Date</span>
          <span className="text-left">Action</span>
        </div>

        <div className="mt-6 space-y-6">
          {Array.isArray(expenses) && expenses.length > 0 ? (
            expenses.map((expense) => (
              <div
                key={expense._id}
                className="grid items-center gap-4 text-xs text-[#f5f5f5] md:grid-cols-[minmax(140px,1fr)_minmax(100px,1fr)_minmax(140px,1fr)_minmax(120px,0.8fr)_0.6fr]"
              >
                <span className="text-left font-medium uppercase tracking-[0.2em] break-words whitespace-normal">
                  {expense.description || 'No description'}
                </span>
                <span className="text-left break-words whitespace-normal max-w-[120px]">
                  {formatCurrency(expense.amount)}
                </span>
                <span className="text-left uppercase tracking-[0.15em] break-words whitespace-normal max-w-[140px]">
                  {expense.category || '—'}
                </span>
                <span className="text-left">
                  {expense.date
                    ? new Date(expense.date).toLocaleDateString()
                    : '—'}
                </span>
                <div className="flex items-center gap-0 text-left">
                  <button
                    type="button"
                    onClick={() => setEditingExpense(expense)}
                    className="rounded-full border border-transparent p-2 text-[#f5c400] transition-colors duration-200 hover:border-[#f5c400] hover:text-[#ffd200]"
                    aria-label={`Edit ${expense.description || 'expense'}`}
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(expense._id)}
                    className="rounded-full border border-transparent p-2 text-[#ff6b6b] transition-colors duration-200 hover:border-[#ff6b6b] hover:text-[#ff8787]"
                    aria-label={`Delete ${expense.description || 'expense'}`}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-6">
              No expenses found. Create one to get started.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExpenseList;
