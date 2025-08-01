import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, requireSuperAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Rediriger vers login avec l'URL de retour
    return <Navigate to="/login" state={{ returnTo: location.pathname }} replace />;
  }

  if (requireSuperAdmin && user?.role !== 'super_admin' && user?.email !== 'christel.aplogan@gmail.com') {
    // Seul le super admin ou Christel peut accéder
    return <Navigate to="/dashboard" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    // Vérifier si c'est Christel (fondatrice) qui a toujours accès admin
    if (user?.email !== 'christel.aplogan@gmail.com') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;