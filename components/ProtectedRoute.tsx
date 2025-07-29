import React from 'react';
import { useAuthContext } from '../hooks/useAuth';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string | string[];
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback,
}) => {
  const { isAuthenticated, hasPermission, hasRole, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Shield className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-slate-600">Please log in to access this content.</p>
        </div>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Shield className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">You don&apos;t have permission to access this content.</p>
        </div>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Shield className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">You don&apos;t have the required role to access this content.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};