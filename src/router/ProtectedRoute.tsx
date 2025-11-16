import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: (0 | 1 | 2)[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
