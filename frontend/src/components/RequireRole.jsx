import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getHomeRoute } from '../auth/demoAuth';
import { useAuth } from '../context/AuthContext';

export default function RequireRole({ role }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (user.role !== role) return <Navigate to={getHomeRoute(user.role)} replace />;
  return <Outlet />;
}
