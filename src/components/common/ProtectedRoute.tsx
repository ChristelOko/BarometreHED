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
  const founderEmail = import.meta.env.VITE_FOUNDER_EMAIL;

  if (!isAuthenticated) {
    // Rediriger vers login avec l'URL de retour
    return <Navigate to="/login" state={{ returnTo: location.pathname }} replace />;
  }

  if (requireSuperAdmin && user?.role !== 'super_admin' && user?.email !== founderEmail) {
    // Seul le super admin ou la fondatrice peut accéder
    return <Navigate to="/dashboard" replace />;
  }

  if (requireAdmin && user?.role !== 'admin' && user?.email !== founderEmail) {
    // Vérifier si c'est l'email de la fondatrice qui a toujours accès admin
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;