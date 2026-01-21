'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  Link as LinkIcon,
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

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
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="mb-8 rounded-2xl bg-white p-8 shadow-xl">
            <div className="flex items-start gap-6">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || ''}
                  className="h-24 w-24 rounded-2xl border-4 border-gray-200 shadow-lg"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-gray-200 bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold text-white shadow-lg">
                  {user.name?.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div
                    className={`inline-block rounded-full bg-gradient-to-r ${getRoleBadgeColor(
                      user.role
                    )} px-4 py-1 text-sm font-bold text-white shadow`}
                  >
                    {user.role.toUpperCase()}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="mb-8 rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Your Permissions
              </h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {user.permissions.map((permission) => (
                <div
                  key={permission}
                  className="flex items-center gap-3 rounded-lg border-2 border-green-100 bg-green-50 p-4"
                >
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-mono text-sm font-semibold text-green-900">
                    {permission}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="mb-8 rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Account Details
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-semibold text-gray-900">User ID</p>
                  <p className="text-sm text-gray-600">{user.id}</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-semibold text-gray-900">Role</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    Total Permissions
                  </p>
                  <p className="text-sm text-gray-600">
                    {user.permissions.length} active permissions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Role-based Information */}
          {user.role === 'viewer' && (
            <div className="rounded-2xl bg-green-50 p-6 shadow-xl">
              <h3 className="mb-2 font-bold text-green-900">
                👁️ Viewer Account
              </h3>
              <p className="text-green-800">
                As a Viewer, you have read-only access to most content. To
                request additional permissions, please contact an administrator.
              </p>
            </div>
          )}

          {user.role === 'editor' && (
            <div className="rounded-2xl bg-blue-50 p-6 shadow-xl">
              <h3 className="mb-2 font-bold text-blue-900">
                ✏️ Editor Account
              </h3>
              <p className="text-blue-800">
                As an Editor, you can create and manage content. You have access
                to the dashboard and content management features.
              </p>
            </div>
          )}

          {user.role === 'admin' && (
            <div className="rounded-2xl bg-red-50 p-6 shadow-xl">
              <h3 className="mb-2 font-bold text-red-900">
                👑 Administrator Account
              </h3>
              <p className="text-red-800">
                You have full administrative access to all features, including
                user management, analytics, and content moderation. Use your
                permissions responsibly.
              </p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
