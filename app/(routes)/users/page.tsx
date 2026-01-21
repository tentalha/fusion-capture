'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { useState, useEffect } from 'react';
import { Users as UsersIcon, Shield, Edit, Trash2, UserPlus } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  accounts: { provider: string }[];
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'editor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AuthGuard requiredPermissions={['manage:users']}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage users, roles, and permissions
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700">
              <UserPlus className="h-5 w-5" />
              Add User
            </button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Edit className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Editors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.role === 'editor').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <UsersIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Viewers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.role === 'viewer').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : (
            <div className="rounded-xl bg-white shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900">All Users</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-6 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-12 w-12 rounded-full border-2 border-gray-200"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${getRoleBadge(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                          <div className="flex gap-1">
                            {user.accounts.map((account, idx) => (
                              <span
                                key={idx}
                                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                              >
                                {account.provider}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        className="rounded-lg border-2 border-gray-200 px-4 py-2 font-medium transition-colors hover:border-blue-300 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>

                      <button className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 rounded-xl bg-red-50 p-6 shadow-lg">
            <h3 className="mb-2 font-bold text-red-900">
              👑 Admin Only Section
            </h3>
            <p className="text-red-800">
              Only users with the Admin role and "manage:users" permission can
              access this page. You can change user roles and manage their
              permissions here.
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
