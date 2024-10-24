import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component }) => {
  const isAdminAuthenticated = localStorage.getItem('isAdmin') === 'true'; 

  return isAdminAuthenticated ? <Navigate to="/admin" /> : <Component />;
};

export default ProtectedRoute;
