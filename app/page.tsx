'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { PermissionGate } from '@/components/PermissionGate';
import Link from 'next/link';
import {
  Shield,
  Users,
  FileText,
  BarChart3,
  Lock,
  CheckCircle,
} from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to FusionCapture
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Please sign in to continue
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'from-red-500 to-red-600';
      case 'editor':
        return 'from-blue-500 to-blue-600';
      case 'viewer':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div
            className={`mx-auto mb-4 inline-block rounded-full bg-gradient-to-r ${getRoleBadgeColor(
              user?.role || ''
            )} px-6 py-2 text-sm font-bold text-white shadow-lg`}
          >
            {user?.role?.toUpperCase()} ACCESS
          </div>
          <h1 className="text-5xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            You are signed in as a <span className="font-semibold">{user?.role}</span>
          </p>
        </div>

        {/* Role-Specific Content */}
        <div className="mb-12 rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Your Permissions
          </h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {user?.permissions.map((permission) => (
              <div
                key={permission}
                className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3"
              >
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-mono text-sm text-green-900">
                  {permission}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Dashboard Card */}
          <PermissionGate roles={['admin', 'editor']}>
            <Link
              href="/dashboard"
              className="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Dashboard
              </h3>
              <p className="text-gray-600">
                View your analytics and insights
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Admin & Editor Only →
              </div>
            </Link>
          </PermissionGate>

          {/* Content Management Card */}
          <PermissionGate permissions={['write:content', 'write:all']}>
            <Link
              href="/content"
              className="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 group-hover:bg-purple-200">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Content</h3>
              <p className="text-gray-600">Manage your content and articles</p>
              <div className="mt-4 text-sm font-semibold text-purple-600">
                Editor Access Required →
              </div>
            </Link>
          </PermissionGate>

          {/* Users Management Card */}
          <PermissionGate permissions={['manage:users']}>
            <Link
              href="/users"
              className="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 group-hover:bg-red-200">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                User Management
              </h3>
              <p className="text-gray-600">Manage users and permissions</p>
              <div className="mt-4 text-sm font-semibold text-red-600">
                Admin Only →
              </div>
            </Link>
          </PermissionGate>

          {/* Analytics Card */}
          <PermissionGate permissions={['view:analytics']}>
            <Link
              href="/analytics"
              className="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 group-hover:bg-green-200">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Analytics
              </h3>
              <p className="text-gray-600">View detailed analytics reports</p>
              <div className="mt-4 text-sm font-semibold text-green-600">
                Admin Only →
              </div>
            </Link>
          </PermissionGate>

          {/* Profile Card - Always Visible */}
          <Link
            href="/profile"
            className="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 group-hover:bg-gray-200">
              <Shield className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Profile</h3>
            <p className="text-gray-600">View and manage your profile</p>
            <div className="mt-4 text-sm font-semibold text-gray-600">
              All Users →
            </div>
          </Link>

          {/* Restricted Content Example */}
          <div className="rounded-2xl bg-gray-100 p-6 shadow-lg opacity-60">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200">
              <Lock className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-500">
              Restricted Feature
            </h3>
            <p className="text-gray-400">
              You don't have access to this feature
            </p>
            <div className="mt-4 text-sm font-semibold text-gray-400">
              Insufficient Permissions
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">
            🎉 Authorization System Demo
          </h2>
          <p className="mb-4 text-blue-100">
            This application demonstrates comprehensive role-based and
            permission-based access control:
          </p>
          <ul className="space-y-2 text-blue-100">
            <li>✓ Protected routes with automatic redirects</li>
            <li>✓ Dynamic navigation based on permissions</li>
            <li>✓ Conditional component rendering</li>
            <li>✓ Role-specific content and UI elements</li>
            <li>✓ SSO with Google and GitHub</li>
            <li>✓ Account linking support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
