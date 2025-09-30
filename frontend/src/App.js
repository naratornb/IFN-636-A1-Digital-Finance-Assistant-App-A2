import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { BudgetProvider } from './context/BudgetContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Budget from './pages/Budget';
import Goal from './pages/Goal';
import Expense from './pages/Expense';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
        <ExpenseProvider>
          <Router>
            <Navbar />
            <Routes>
			  <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/goal" element={<Goal />} />
              <Route path="/expense" element={<Expense />} />
            </Routes>
          </Router>
        </ExpenseProvider>
      </BudgetProvider>
    </AuthProvider>
  );
}

export default App;
