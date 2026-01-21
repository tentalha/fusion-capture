'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallbackUrl?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackUrl = '/login',
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, hasRole, hasAnyPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(fallbackUrl);
      return;
    }

    if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
      router.push('/unauthorized');
      return;
    }

    if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) {
      router.push('/unauthorized');
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    requireAuth,
    requiredRoles,
    requiredPermissions,
    fallbackUrl,
    router,
    hasRole,
    hasAnyPermission,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return null;
  }

  if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) {
    return null;
  }

  return <>{children}</>;
}
