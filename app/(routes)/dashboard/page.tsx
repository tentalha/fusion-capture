'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/lib/hooks/useAuth';
import { PermissionGate } from '@/components/PermissionGate';
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Activity,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Users', value: '2,543', icon: Users, change: '+12%' },
    { label: 'Active Content', value: '847', icon: FileText, change: '+5%' },
    { label: 'Revenue', value: '$45.2K', icon: DollarSign, change: '+23%' },
    { label: 'Engagement', value: '94%', icon: Activity, change: '+8%' },
  ];

  const recentActivity = [
    { action: 'New user registered', time: '2 minutes ago', user: 'John Doe' },
    { action: 'Content published', time: '15 minutes ago', user: 'Jane Smith' },
    { action: 'Settings updated', time: '1 hour ago', user: 'Admin' },
    { action: 'Report generated', time: '2 hours ago', user: 'System' },
  ];

  return (
    <AuthGuard requiredRoles={['admin', 'editor']}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.name}! Here's what's happening.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-green-600">
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h2>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">
                        by {activity.user}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <PermissionGate permissions={['write:all', 'write:content']}>
                  <button className="flex w-full items-center gap-3 rounded-lg bg-blue-50 p-4 text-left transition-colors hover:bg-blue-100">
                    <Edit className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">
                        Create New Content
                      </p>
                      <p className="text-sm text-blue-700">
                        Start writing a new article or post
                      </p>
                    </div>
                  </button>
                </PermissionGate>

                <PermissionGate permissions={['manage:users']}>
                  <button className="flex w-full items-center gap-3 rounded-lg bg-purple-50 p-4 text-left transition-colors hover:bg-purple-100">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-purple-900">
                        Manage Users
                      </p>
                      <p className="text-sm text-purple-700">
                        Add, edit, or remove users
                      </p>
                    </div>
                  </button>
                </PermissionGate>

                <PermissionGate permissions={['view:analytics']}>
                  <button className="flex w-full items-center gap-3 rounded-lg bg-green-50 p-4 text-left transition-colors hover:bg-green-100">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">
                        View Analytics
                      </p>
                      <p className="text-sm text-green-700">
                        Detailed insights and reports
                      </p>
                    </div>
                  </button>
                </PermissionGate>

                {/* This button is disabled for editors */}
                <PermissionGate
                  permissions={['delete:all']}
                  fallback={
                    <button
                      disabled
                      className="flex w-full items-center gap-3 rounded-lg bg-gray-100 p-4 text-left opacity-50 cursor-not-allowed"
                    >
                      <Trash2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-semibold text-gray-500">
                          Delete Items
                        </p>
                        <p className="text-sm text-gray-400">
                          Admin permission required
                        </p>
                      </div>
                    </button>
                  }
                >
                  <button className="flex w-full items-center gap-3 rounded-lg bg-red-50 p-4 text-left transition-colors hover:bg-red-100">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">Delete Items</p>
                      <p className="text-sm text-red-700">
                        Remove unwanted content
                      </p>
                    </div>
                  </button>
                </PermissionGate>
              </div>
            </div>
          </div>

          {/* Role-specific message */}
          {user?.role === 'editor' && (
            <div className="mt-8 rounded-xl bg-blue-50 p-6 shadow-lg">
              <h3 className="mb-2 font-bold text-blue-900">
                👋 Editor View
              </h3>
              <p className="text-blue-800">
                You're viewing this dashboard as an Editor. Some actions like
                "Delete Items" are restricted to Admins only.
              </p>
            </div>
          )}

          {user?.role === 'admin' && (
            <div className="mt-8 rounded-xl bg-red-50 p-6 shadow-lg">
              <h3 className="mb-2 font-bold text-red-900">
                👑 Admin View
              </h3>
              <p className="text-red-800">
                You have full administrative access. All features and actions
                are available to you.
              </p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
