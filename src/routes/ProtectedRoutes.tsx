import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  element: React.ComponentType; 
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element: Component }) => {
  const isAdminAuthenticated = localStorage.getItem('isAdmin') === 'true'; 

  return isAdminAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default AdminRoute;
