import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses =
    'uppercase tracking-[0.35em] text-xs font-medium text-[#cfcfcf] hover:text-white transition-colors duration-200';
  const ctaClasses =
    'uppercase tracking-[0.35em] text-xs font-semibold bg-[#f5c400] text-[#1f1f1f] px-6 py-2 rounded-none shadow-[0_6px_18px_rgba(245,196,0,0.35)] hover:bg-[#ffd200] transition-colors duration-200';

  return (
    <nav className="bg-[#2f2f2f] text-white px-12 py-5 flex items-center justify-between shadow-[0_6px_18px_rgba(0,0,0,0.4)]">
      <Link
        to="/dashboard"
        className="uppercase tracking-[0.8em] text-sm font-semibold text-white hover:text-[#f5c400] transition-colors duration-200"
      >
        Maxworth
      </Link>

      <div className="flex items-center gap-10">
        {user ? (
          <>
            <Link to="/reports" className={linkClasses}>
              Reports
            </Link>
            <Link to="/expense" className={linkClasses}>
              Expense
            </Link>
            <Link to="/budget" className={linkClasses}>
              Budget
            </Link>
            <Link to="/goal" className={linkClasses}>
              Goals
            </Link>
            <Link to="/profile" className={linkClasses}>
              Profile
            </Link>
            <button type="button" onClick={handleLogout} className={ctaClasses}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={linkClasses}>
              Login
            </Link>
            <Link to="/register" className={ctaClasses}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
