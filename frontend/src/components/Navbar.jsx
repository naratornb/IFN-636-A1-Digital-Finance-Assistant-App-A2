import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#464646] h-24 flex items-center justify-between px-12 shadow-[0_6px_18px_rgba(0,0,0,0.4)]">
      {/* Logo and Brand */}
      <div className="flex items-center space-x-4">
        <div className="text-white">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14.5L8 11.5V13.5L12 16.5L16 13.5V11.5L12 14.5ZM20 5V19H18V10L12 14.5L6 10V19H4V5L12 10.5L20 5Z" fill="#EFEFEF"/>
          </svg>
        </div>
        <Link
          to="/"
          className="text-white text-2xl font-bold tracking-wider hover:text-[#f5c400] transition-colors duration-200"
        >
          MAXWORTH
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-10">
        {user ? (
          <>
            <Link 
              to="/reports" 
              className="text-[#cfcfcf] text-sm font-medium uppercase tracking-[0.35em] hover:text-white transition-colors duration-200"
            >
              Reports
            </Link>
            <Link 
              to="/expense" 
              className="text-[#cfcfcf] text-sm font-medium uppercase tracking-[0.35em] hover:text-white transition-colors duration-200"
            >
              Expense
            </Link>
            <Link 
              to="/budget" 
              className="text-[#cfcfcf] text-sm font-medium uppercase tracking-[0.35em] hover:text-white transition-colors duration-200"
            >
              Budget
            </Link>
            <Link 
              to="/goal" 
              className="text-[#cfcfcf] text-sm font-medium uppercase tracking-[0.35em] hover:text-white transition-colors duration-200"
            >
              Goals
            </Link>
            <Link 
              to="/profile" 
              className="text-[#cfcfcf] text-sm font-medium uppercase tracking-[0.35em] hover:text-white transition-colors duration-200"
            >
              Profile
            </Link>
            
            {/* Login Button */}
            <button
              onClick={handleLogout}
              className="border-2 border-yellow-400 text-white px-6 py-2 rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition-colors duration-300"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-[#cfcfcf] text-sm font-medium uppercase tracking-[0.35em] hover:text-white transition-colors duration-200"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-300 font-medium uppercase tracking-[0.35em]"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;