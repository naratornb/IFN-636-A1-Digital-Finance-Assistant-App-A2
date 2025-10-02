import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const response = await axiosInstance.get('/api/reports', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        setDashboardData(response.data.data || response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.token) {
      fetchDashboardData();
    } else {
      setError('You must be logged in to view the dashboard');
      setLoading(false);
    }
  }, [user?.token]);

  const {
    totalExpenses,
    totalBudget,
    remainingBudget,
    spentPercentage,
    remainingPercentage
  } = dashboardData;

  if (!user?.token) {
    return (
      <div className="min-h-screen bg-[#4d4d4d] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-[#f5c400] mb-6">Welcome to MAXWORTH</h1>
        <p className="text-lg text-[#cfcfcf] mb-8">Please log in to access your financial dashboard.</p>
        <a href="/login" className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-300 font-medium uppercase tracking-[0.35em]">Log In</a>
      </div>
    );
  }

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
        <div className="mb-10">
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-2">Financial Dashboard</h1>
          <p className="text-[#cfcfcf]">Overview of your financial activity for the last 365 days</p>
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
            <p className="text-sm text-[#cfcfcf]">Last 365 days</p>
          </div>

          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-[#4d4d4d] rounded-full mr-4">
                <FiTrendingUp className="text-[#4ade80] text-xl" />
              </div>
              <h2 className="text-lg font-semibold uppercase tracking-[0.15em]">Total Budget</h2>
            </div>
            <p className="text-3xl font-bold mb-2">${totalBudget.toFixed(2)}</p>
            <p className="text-sm text-[#cfcfcf]">Last 365 days</p>
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
          {/* Conditional rendering for goals */}
          {dashboardData.goals && dashboardData.goals.length > 0 ? (

<div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)] flex flex-col items-center">
              <div className="flex items-center mb-6">
                <FiPieChart className="text-[#f5c400] mr-2" />
                <h2 className="text-xl font-semibold uppercase tracking-[0.15em]">Goal Progress</h2>
              </div>
              {/* Pie chart for first goal */}
              {(() => {
                const goal = dashboardData.goals[0];
                const current = parseFloat(goal.current || 0);
                const target = parseFloat(goal.target || 1);
                const percent = Math.min((current / target) * 100, 100);
                return (
                  <div className="relative w-48 h-48 rounded-full mb-6">
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#f5c400 0% ${percent}%, #707070 ${percent}% 100%)`
                      }}
                    ></div>
                    <div className="absolute inset-8 bg-[#5a5a5a] rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{percent.toFixed(1)}%</div>
                        <div className="text-xs text-[#cfcfcf]">Saved</div>
                        <div className="text-xs text-[#cfcfcf]">${current.toFixed(2)} / ${target.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              <div className="text-center">
                <div className="text-lg font-semibold">{dashboardData.goals[0].name}</div>
                <div className="text-xs text-[#cfcfcf]">Deadline: {dashboardData.goals[0].deadline ? new Date(dashboardData.goals[0].deadline).toLocaleDateString() : 'N/A'}</div>
                <div className="text-xs text-[#cfcfcf]">Description: {dashboardData.goals[0].description || 'No description'}</div>
              </div>
            </div>
          ) : (
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
          )}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <h2 className="text-xl font-semibold uppercase tracking-[0.15em] mb-6">Top Spending Categories</h2>
            <div className="space-y-4">
              {dashboardData.topCategories.length > 0 ? (
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
            <h2 className="text-xl font-semibold uppercase tracking-[0.15em] mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {dashboardData.recentTransactions.length > 0 ? (
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
                  No recent transactions
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
