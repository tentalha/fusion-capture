'use client';

import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  const hasRole = (role: string | string[]) => {
    if (!session?.user?.role) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(session.user.role);
  };

  const hasPermission = (permission: string | string[]) => {
    if (!session?.user?.permissions) return false;
    const permissions = Array.isArray(permission) ? permission : [permission];
    return permissions.some((perm) =>
      session.user.permissions.includes(perm)
    );
  };

  const hasAnyPermission = (permissions: string[]) => {
    if (!session?.user?.permissions) return false;
    return permissions.some((perm) =>
      session.user.permissions.includes(perm)
    );
  };

  const hasAllPermissions = (permissions: string[]) => {
    if (!session?.user?.permissions) return false;
    return permissions.every((perm) =>
      session.user.permissions.includes(perm)
    );
  };

  return {
    session,
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
