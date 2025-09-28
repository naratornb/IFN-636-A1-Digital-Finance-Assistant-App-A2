import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import BudgetService from '../services/BudgetService';

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
    recentTransactions: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Calculate date range (last 365 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 365);
        
        // Fetch expenses
        const expensesResponse = await axiosInstance.get('/api/expenses', {
          headers: { Authorization: `Bearer ${user.token}` },
          params: {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
          }
        });
        
        // Fetch budgets
        const budgetsResponse = await BudgetService.getBudgets(user.token);
        
        // Process data
        const expenses = expensesResponse.data;
        const budgets = budgetsResponse.data;
        
        // Calculate totals
        const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.totalBudget), 0);
        const remainingBudget = totalBudget - totalExpenses;
        
        // Process expense trend (last 6 months)
        const expenseTrend = [];
        const currentDate = new Date();
        for (let i = 5; i >= 0; i--) {
          const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthName = monthDate.toLocaleString('default', { month: 'short' });
          
          const monthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.deadline);
            return expenseDate.getMonth() === monthDate.getMonth() && 
                   expenseDate.getFullYear() === monthDate.getFullYear();
          });
          
          const monthTotal = monthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
          
          expenseTrend.push({
            name: monthName,
            amount: monthTotal
          });
        }
        
        // Process budget comparison (last 6 months)
        const budgetComparison = [];
        for (let i = 5; i >= 0; i--) {
          const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthName = monthDate.toLocaleString('default', { month: 'short' });
          
          const monthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.deadline);
            return expenseDate.getMonth() === monthDate.getMonth() && 
                   expenseDate.getFullYear() === monthDate.getFullYear();
          });
          
          const monthExpenseTotal = monthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
          
          // Find budget for this month
          const monthBudget = budgets.find(budget => {
            const budgetStart = new Date(budget.startDate);
            return budgetStart.getMonth() === monthDate.getMonth() && 
                   budgetStart.getFullYear() === monthDate.getFullYear();
          });
          
          const monthBudgetTotal = monthBudget ? parseFloat(monthBudget.totalBudget) : 0;
          
          budgetComparison.push({
            name: monthName,
            expenses: monthExpenseTotal,
            budget: monthBudgetTotal
          });
        }
        
        // Process top categories
        const categoryMap = {};
        expenses.forEach(expense => {
          const category = expense.paymentMethod || 'Other';
          if (!categoryMap[category]) {
            categoryMap[category] = 0;
          }
          categoryMap[category] += parseFloat(expense.amount);
        });
        
        const topCategories = Object.entries(categoryMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, value]) => ({ name, value }));
        
        // Process recent transactions
        const recentTransactions = expenses
          .sort((a, b) => new Date(b.deadline) - new Date(a.deadline))
          .slice(0, 5);
        
        setDashboardData({
          totalExpenses,
          totalBudget,
          remainingBudget,
          expenseTrend,
          budgetComparison,
          topCategories,
          recentTransactions
        });
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

  // Calculate percentages for pie chart
  const spentPercentage = dashboardData.totalBudget > 0 
    ? (dashboardData.totalExpenses / dashboardData.totalBudget) * 100 
    : 0;
  const remainingPercentage = 100 - spentPercentage;

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
            <p className="text-3xl font-bold mb-2">${dashboardData.totalExpenses.toFixed(2)}</p>
            <p className="text-sm text-[#cfcfcf]">Last 365 days</p>
          </div>

          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-[#4d4d4d] rounded-full mr-4">
                <FiTrendingUp className="text-[#4ade80] text-xl" />
              </div>
              <h2 className="text-lg font-semibold uppercase tracking-[0.15em]">Total Budget</h2>
            </div>
            <p className="text-3xl font-bold mb-2">${dashboardData.totalBudget.toFixed(2)}</p>
            <p className="text-sm text-[#cfcfcf]">Last 365 days</p>
          </div>

          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-[#4d4d4d] rounded-full mr-4">
                <FiPieChart className="text-[#60a5fa] text-xl" />
              </div>
              <h2 className="text-lg font-semibold uppercase tracking-[0.15em]">Remaining Budget</h2>
            </div>
            <p className={`text-3xl font-bold mb-2 ${dashboardData.remainingBudget >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
              ${Math.abs(dashboardData.remainingBudget).toFixed(2)}
            </p>
            <p className="text-sm text-[#cfcfcf]">
              {dashboardData.remainingBudget >= 0 ? 'Under budget' : 'Over budget'}
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
                    <div className="text-xs text-[#cfcfcf]">${dashboardData.totalExpenses.toFixed(2)} ({spentPercentage.toFixed(1)}%)</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#60a5fa] rounded mr-2"></div>
                  <div>
                    <div className="text-sm font-medium">Remaining</div>
                    <div className="text-xs text-[#cfcfcf]">${Math.abs(dashboardData.remainingBudget).toFixed(2)} ({remainingPercentage.toFixed(1)}%)</div>
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
                  <span className="text-sm font-semibold">${dashboardData.totalBudget.toFixed(2)}</span>
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
                  <span className="text-sm font-semibold">${dashboardData.totalExpenses.toFixed(2)}</span>
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
                  {dashboardData.remainingBudget >= 0 ? (
                    <FiArrowDown className="text-[#4ade80] mr-2" />
                  ) : (
                    <FiArrowUp className="text-[#f87171] mr-2" />
                  )}
                  <span className={`text-sm font-medium ${dashboardData.remainingBudget >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {dashboardData.remainingBudget >= 0 ? 'Under budget by' : 'Over budget by'} ${Math.abs(dashboardData.remainingBudget).toFixed(2)}
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
              {dashboardData.topCategories.map((category, index) => {
                const percentage = (category.value / dashboardData.totalExpenses) * 100;
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
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[#5a5a5a] border border-[#707070] rounded-lg p-6 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
            <h2 className="text-xl font-semibold uppercase tracking-[0.15em] mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {dashboardData.recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b border-[#4a4a4a]">
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-xs text-[#cfcfcf]">
                      {new Date(transaction.deadline).toLocaleDateString()} • {transaction.paymentMethod || 'Other'}
                    </p>
                  </div>
                  <span className="font-semibold text-[#f87171]">-${parseFloat(transaction.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;