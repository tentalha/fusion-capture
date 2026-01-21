'use client';

import { useAuth } from '@/lib/hooks/useAuth';

interface PermissionGateProps {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback = null,
}: PermissionGateProps) {
  const { hasRole, hasPermission, hasAllPermissions, hasAnyPermission } =
    useAuth();

  let hasAccess = true;

  if (roles.length > 0) {
    hasAccess = hasRole(roles);
  }

  if (permissions.length > 0 && hasAccess) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
