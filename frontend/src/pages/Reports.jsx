import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiArrowUp, FiArrowDown, FiCalendar, FiDownload, FiList, FiTrash2, FiX, FiClock } from 'react-icons/fi';

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showDownloadLogs, setShowDownloadLogs] = useState(false);
  const [downloadLogs, setDownloadLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);
  const [logError, setLogError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalExpenses: 0,
    totalBudget: 0,
    remainingBudget: 0,
    expenseTrend: [],
    budgetComparison: [],
    topCategories: [],
    recentTransactions: [],
    spentPercentage: 0,
    remainingPercentage: 100
  });

  useEffect(() => {
    if (!startDate || !endDate) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);

      setEndDate(end.toISOString().split('T')[0]);
      setStartDate(start.toISOString().split('T')[0]);
    }
  }, []);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!startDate || !endDate) return;

      try {
        setLoading(true);

        const response = await axiosInstance.get(`/api/reports?startDate=${startDate}&endDate=${endDate}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        setDashboardData(response.data.data || response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch report data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token && startDate && endDate) {
      fetchReportData();
    } else if (!user?.token) {
      setError('You must be logged in to view reports');
      setLoading(false);
    }
  }, [user?.token, startDate, endDate]);

  const {
    totalExpenses,
    totalBudget,
    remainingBudget,
    spentPercentage,
    remainingPercentage
  } = dashboardData;

  const handleDateRangeSubmit = (e) => {
    e.preventDefault();
  };

  const handleDownloadReport = async () => {
    try {
      setDownloadLoading(true);

      const response = await axiosInstance.get(`/api/reports/pdf?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        responseType: 'blob' 
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      const formattedStartDate = new Date(startDate).toLocaleDateString().replace(/\//g, '-');
      const formattedEndDate = new Date(endDate).toLocaleDateString().replace(/\//g, '-');
      link.download = `financial_report_${formattedStartDate}_to_${formattedEndDate}.pdf`;

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download report');
    } finally {
      setDownloadLoading(false);
    }
  };

  const fetchDownloadLogs = async () => {
    try {
      setLogsLoading(true);
      setLogError('');

      const response = await axiosInstance.get('/api/reports/download-logs', {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setDownloadLogs(response.data.data.logs || []);
    } catch (err) {
      console.error('Error fetching download logs:', err);
      setLogError('Failed to fetch download history');
    } finally {
      setLogsLoading(false);
    }
  };

  const handleShowLogs = () => {
    setShowDownloadLogs(true);
    fetchDownloadLogs();
  };

  const handleClearLogs = async () => {
    try {
      setClearingLogs(true);
      setLogError('');

      await axiosInstance.delete('/api/reports/download-logs', {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setDownloadLogs([]);
    } catch (err) {
      console.error('Error clearing download logs:', err);
      setLogError('Failed to clear download history');
    } finally {
      setClearingLogs(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#4d4d4d] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5c400]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#4d4d4d] flex justify-center items-center">
        <div className="bg-red-900 bg-opacity-30 text-red-400 p-6 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4d4d4d] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-2">Financial Reports</h1>
          <p className="text-[#cfcfcf]">Custom financial report with date range selection</p>
        </div>

        {/* Date Range Selector */}
        <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)] mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-[#4d4d4d] rounded-full mr-4">
                <FiCalendar className="text-[#f5c400] text-xl" />
              </div>
              <h2 className="text-lg font-semibold uppercase tracking-[0.15em]">Select Date Range</h2>
            </div>

            {/* Download History Button */}
            <button
              onClick={handleShowLogs}
              className="px-4 py-2 bg-[#4d4d4d] text-white font-medium rounded hover:bg-[#3d3d3d] transition-colors flex items-center gap-2"
            >
              <FiList className="text-lg" />
              Download History
            </button>
          </div>

          <form onSubmit={handleDateRangeSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-[#4d4d4d] border border-[#707070] rounded text-white"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 bg-[#4d4d4d] border border-[#707070] rounded text-white"
                required
              />
            </div>

            {/* Download Report Button */}
              <button
                onClick={handleDownloadReport}
                className="px-6 py-3 bg-[#f5c400] text-black font-semibold rounded hover:bg-[#e5b700] transition-colors flex items-center justify-center gap-2 mx-auto"
                disabled={downloadLoading}
              >
                {downloadLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#e5b700]"></div>
                ) : (
                  <FiDownload className="text-xl" />
                )}
                {downloadLoading ? 'Generating PDF...' : 'Download Report'}
              </button>
          </form>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-[#4d4d4d] rounded-full mr-4">
                <FiDollarSign className="text-[#f5c400] text-xl" />
              </div>
              <h2 className="text-lg font-semibold uppercase tracking-[0.15em]">Total Expenses</h2>
            </div>
            <p className="text-3xl font-bold mb-2">${totalExpenses.toFixed(2)}</p>
            <p className="text-sm text-[#cfcfcf]">
              {startDate && endDate ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}` : 'Custom period'}
            </p>
          </div>

          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-[#4d4d4d] rounded-full mr-4">
                <FiTrendingUp className="text-[#4ade80] text-xl" />
              </div>
              <h2 className="text-lg font-semibold uppercase tracking-[0.15em]">Total Budget</h2>
            </div>
            <p className="text-3xl font-bold mb-2">${totalBudget.toFixed(2)}</p>
            <p className="text-sm text-[#cfcfcf]">
              {startDate && endDate ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}` : 'Custom period'}
            </p>
          </div>

          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-[#4d4d4d] rounded-full mr-4">
                <FiPieChart className="text-[#60a5fa] text-xl" />
              </div>
              <h2 className="text-lg font-semibold uppercase tracking-[0.15em]">Remaining Budget</h2>
            </div>
            <p className={`text-3xl font-bold mb-2 ${remainingBudget >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
              ${Math.abs(remainingBudget).toFixed(2)}
            </p>
            <p className="text-sm text-[#cfcfcf]">
              {remainingBudget >= 0 ? 'Under budget' : 'Over budget'}
            </p>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Budget vs Expenses Pie Chart */}
          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <div className="flex items-center mb-6">
              <FiPieChart className="text-[#60a5fa] mr-2" />
              <h2 className="text-xl font-semibold uppercase tracking-[0.15em]">Budget Utilization</h2>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 rounded-full mb-6">
                {/* Pie Chart using conic gradient */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #f87171 0% ${spentPercentage}%, 
                      #60a5fa ${spentPercentage}% 100%
                    )`
                  }}
                ></div>
                {/* Center circle to create a donut chart */}
                <div className="absolute inset-8 bg-[#5a5a5a] rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{spentPercentage.toFixed(1)}%</div>
                    <div className="text-xs text-[#cfcfcf]">Spent</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center space-x-8">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#f87171] rounded mr-2"></div>
                  <div>
                    <div className="text-sm font-medium">Spent</div>
                    <div className="text-xs text-[#cfcfcf]">${totalExpenses.toFixed(2)} ({spentPercentage.toFixed(1)}%)</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#60a5fa] rounded mr-2"></div>
                  <div>
                    <div className="text-sm font-medium">Remaining</div>
                    <div className="text-xs text-[#cfcfcf]">${Math.abs(remainingBudget).toFixed(2)} ({remainingPercentage.toFixed(1)}%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Status */}
          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <div className="flex items-center mb-6">
              <FiTrendingUp className="text-[#4ade80] mr-2" />
              <h2 className="text-xl font-semibold uppercase tracking-[0.15em]">Budget Status</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Budget</span>
                  <span className="text-sm font-semibold">${totalBudget.toFixed(2)}</span>
                </div>
                <div className="w-full bg-[#4a4a4a] rounded-full h-3">
                  <div
                    className="bg-[#60a5fa] h-3 rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Amount Spent</span>
                  <span className="text-sm font-semibold">${totalExpenses.toFixed(2)}</span>
                </div>
                <div className="w-full bg-[#4a4a4a] rounded-full h-3">
                  <div
                    className="bg-[#f87171] h-3 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${spentPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#4a4a4a]">
                <div className="flex items-center">
                  {remainingBudget >= 0 ? (
                    <FiArrowDown className="text-[#4ade80] mr-2" />
                  ) : (
                    <FiArrowUp className="text-[#f87171] mr-2" />
                  )}
                  <span className={`text-sm font-medium ${remainingBudget >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {remainingBudget >= 0 ? 'Under budget by' : 'Over budget by'} ${Math.abs(remainingBudget).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <h2 className="text-xl font-semibold uppercase tracking-[0.15em] mb-6">Top Spending Categories</h2>
            <div className="space-y-4">
              {dashboardData.topCategories && dashboardData.topCategories.length > 0 ? (
                dashboardData.topCategories.map((category, index) => {
                  const percentage = (category.value / totalExpenses) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm font-semibold">${category.value.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-[#4a4a4a] rounded-full h-2">
                        <div
                          className="bg-[#f5c400] h-2 rounded-full transition-all duration-500 ease-in-out"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-[#cfcfcf]">{percentage.toFixed(1)}% of total</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-400">
                  No category data available
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <h2 className="text-xl font-semibold uppercase tracking-[0.15em] mb-6">Transactions in Period</h2>
            <div className="space-y-4">
              {dashboardData.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
                dashboardData.recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">{transaction.description || 'Unnamed Transaction'}</div>
                      <div className="text-xs text-[#cfcfcf]">
                        {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'No date'} • {transaction.category || 'Uncategorized'}
                      </div>
                    </div>
                    <span className="font-semibold text-[#f87171]">-${parseFloat(transaction.amount).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400">
                  No transactions in this period
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Download History Modal */}
        {showDownloadLogs && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#707070]">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FiClock className="text-[#f5c400]" />
                  Report Download History
                </h2>
                <button
                  onClick={() => setShowDownloadLogs(false)}
                  className="p-2 hover:bg-[#4d4d4d] rounded-full transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 overflow-y-auto flex-grow">
                {logsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5c400]"></div>
                  </div>
                ) : logError ? (
                  <div className="text-red-400 text-center py-4">{logError}</div>
                ) : downloadLogs.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">No download history found</div>
                ) : (
                  <div className="space-y-1">
                    {downloadLogs.map((log, index) => (
                      <div
                        key={index}
                        className="bg-[#4d4d4d] p-3 rounded flex flex-col sm:flex-row sm:justify-between gap-2 border border-[#707070]"
                      >
                        <div>
                          <div className="font-medium">{log.fileName || "Financial Report"}</div>
                          <div className="text-sm text-[#cfcfcf]">
                            {log.dateRange?.startDate && log.dateRange?.endDate ? (
                              `Report period: ${new Date(log.dateRange.startDate).toLocaleDateString()} - ${new Date(log.dateRange.endDate).toLocaleDateString()}`
                            ) : "No date range"}
                          </div>
                        </div>
                        <div className="text-xs text-[#cfcfcf] whitespace-nowrap">
                          Downloaded on {formatDate(log.downloadTime)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#707070] flex justify-between items-center">
                <div className="text-sm text-[#cfcfcf]">
                  {downloadLogs.length} {downloadLogs.length === 1 ? 'record' : 'records'} found
                </div>
                <button
                  onClick={handleClearLogs}
                  disabled={clearingLogs || downloadLogs.length === 0}
                  className={`px-4 py-2 bg-red-800 text-white rounded flex items-center gap-2 hover:bg-red-700 transition-colors ${
                    clearingLogs || downloadLogs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {clearingLogs ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <FiTrash2 />
                  )}
                  {clearingLogs ? 'Clearing...' : 'Clear History'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
