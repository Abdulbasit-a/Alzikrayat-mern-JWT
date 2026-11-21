import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="navbar-start">
          <Logo />
          <NavLink to="/gallery" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            المعرض
          </NavLink>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="nav-greeting" dir="auto">
                مرحباً، <strong>{user.firstName} {user.lastName}</strong>
              </span>
              <Link to="/upload" className="btn btn-amber btn-sm">➕ رفع صورة</Link>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>تسجيل الخروج</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">تسجيل الدخول</Link>
              <Link to="/register" className="btn btn-amber btn-sm">حساب جديد</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
