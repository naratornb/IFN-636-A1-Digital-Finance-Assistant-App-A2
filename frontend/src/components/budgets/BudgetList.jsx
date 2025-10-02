import { FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';

const BudgetList = ({ 
  budgets = [],
  setEditingBudget,
  loading, 
  error, 
  handleDelete
}) => {

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section className="bg-[#3f3f3f] border border-[#5c5c5c] px-8 py-10 shadow-[0_18px_36px_rgba(0,0,0,0.35)] w-full">
      <h2 className="mb-8 text-lg font-semibold uppercase tracking-[0.4em] text-[#f0f0f0]">
        Budget Planning
      </h2>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 text-red-400 p-3 rounded-md mb-6 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5c400]"></div>
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-[#4a4a4a] rounded-lg p-8 text-center w-full">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#5a5a5a] mb-4">
            <svg className="h-6 w-6 text-[#f5c400]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#f0f0f0] mb-2">No budgets found</h3>
          <p className="text-[#cfcfcf] mb-4">Create your first budget to start tracking your finances.</p>
        </div>
      ) : (
  <div className="w-full overflow-x-auto">
          {/* Header row - hidden on mobile, visible on medium screens and above */}
          <div className="hidden text-xs uppercase tracking-[0.25em] text-[#cfcfcf] md:grid md:grid-cols-[180px_90px_160px_120px_50px] md:gap-3 md:border-b md:border-[#5c5c5c] md:pb-4 w-full">
            <span className="text-left">Period</span>
            <span className="text-left">Budget</span>
            <span className="text-left">Date Range</span>
            <span className="text-left">Notes</span>
            <span className="text-left">Action</span>
          </div>

          {/* Budget items */}
          <div className="mt-6 space-y-6 w-full">
            {budgets.map((budget) => (
              <div
                key={budget._id}
                className="grid items-center gap-3 text-xs text-[#f5f5f5] md:grid-cols-[180px_90px_160px_120px_50px] w-full"
              >
                {/* Period column with status badge */}
                <div className="text-left font-medium uppercase tracking-[0.2em] break-words whitespace-normal">
                  <span>{budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    budget.status === 'active'
                      ? 'bg-green-900 bg-opacity-30 text-green-400'
                      : 'bg-red-900 bg-opacity-30 text-red-400'
                  }`}>
                    {budget.status}
                  </span>
                </div>

                {/* Budget amount column */}
                <div className="text-left break-words whitespace-normal max-w-[120px]">
                  <span className="text-[#cfcfcf] mr-1">$</span>
                  <span>{parseFloat(budget.totalBudget).toFixed(2)}</span>
                </div>

                {/* Date range column */}
                <div className="text-left break-words whitespace-normal max-w-[200px]">
                  <div className="flex items-center">
                    <FiCalendar className="inline-block w-4 h-4 mr-2" />
                    {formatDateForDisplay(budget.startDate)} - {formatDateForDisplay(budget.endDate)}
                  </div>
                </div>

                {/* Notes column */}
                <div className="text-left uppercase tracking-[0.15em] break-words whitespace-normal max-w-[150px]">
                  {budget.notes || <span className="text-[#999]">No notes</span>}
                </div>

                {/* Actions column */}
                <div className="flex items-center gap-0 text-left">
                  <button
                    type="button"
                    onClick={() => setEditingBudget(budget)}
                    className="rounded-full border border-transparent p-2 text-[#f5c400] transition-colors duration-200 hover:border-[#f5c400] hover:text-[#ffd200]"
                    aria-label={`Edit ${budget.period} budget`}
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(budget._id)}
                    className="rounded-full border border-transparent p-2 text-[#ff6b6b] transition-colors duration-200 hover:border-[#ff6b6b] hover:text-[#ff8787]"
                    aria-label={`Delete ${budget.period} budget`}
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

export default BudgetList;
