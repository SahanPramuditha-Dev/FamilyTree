import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, checkSessionExpired } from '../../context/AuthContext';
import { Trees } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 dark:bg-forest-700 text-white flex items-center justify-center mx-auto animate-pulse">
            <Trees className="w-6 h-6" />
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">Loading your family workspace...</p>
        </div>
      </div>
    );
  }

  if (user && checkSessionExpired()) {
    logout();
    return <Navigate to="/login?expired=true" replace state={{ from: location.pathname }} />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

/** Route guard that additionally requires admin role. */
export const AdminRoute: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 dark:bg-forest-700 text-white flex items-center justify-center mx-auto animate-pulse">
            <Trees className="w-6 h-6" />
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (user && checkSessionExpired()) {
    logout();
    return <Navigate to="/login?expired=true" replace state={{ from: location.pathname }} />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
