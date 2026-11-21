import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from './StatusMessage';

// Redirects anonymous visitors to the login view and remembers where they wanted to go
function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) return <Loading text="جارٍ التحقق من الجلسة..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default ProtectedRoute;
