'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { PermissionGate } from '@/components/PermissionGate';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';

export default function ContentPage() {
  const { user } = useAuth();

  const contentItems = [
    {
      id: 1,
      title: 'Getting Started with Next.js',
      status: 'published',
      author: 'John Doe',
      views: 1234,
      date: '2024-12-10',
    },
    {
      id: 2,
      title: 'Understanding TypeScript',
      status: 'draft',
      author: 'Jane Smith',
      views: 0,
      date: '2024-12-11',
    },
    {
      id: 3,
      title: 'React Server Components',
      status: 'review',
      author: user?.name || 'Current User',
      views: 567,
      date: '2024-12-09',
    },
    {
      id: 4,
      title: 'Database Design Patterns',
      status: 'published',
      author: 'Admin',
      views: 2341,
      date: '2024-12-08',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4" />;
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'review':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <AuthGuard requiredPermissions={['write:content', 'write:all']}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Content Management
              </h1>
              <p className="mt-2 text-gray-600">
                Create, edit, and manage your content
              </p>
            </div>
            <PermissionGate permissions={['write:all', 'write:content']}>
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl">
                <Plus className="h-5 w-5" />
                New Content
              </button>
            </PermissionGate>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contentItems.filter((item) => item.status === 'published').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <Edit className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contentItems.filter((item) => item.status === 'draft').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contentItems.filter((item) => item.status === 'review').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contentItems.reduce((acc, item) => acc + item.views, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content List */}
          <div className="rounded-xl bg-white shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900">All Content</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {contentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-6 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                        <span>by {item.author}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views.toLocaleString()} views
                        </span>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {getStatusIcon(item.status)}
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <PermissionGate permissions={['write:all', 'write:content']}>
                      <button className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100">
                        <Edit className="h-5 w-5" />
                      </button>
                    </PermissionGate>

                    <PermissionGate
                      permissions={['delete:all']}
                      fallback={
                        <button
                          disabled
                          className="rounded-lg bg-gray-100 p-2 text-gray-400 opacity-50 cursor-not-allowed"
                          title="Admin permission required"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      }
                    >
                      <button className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </PermissionGate>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permission Info */}
          <div className="mt-8 rounded-xl bg-purple-50 p-6 shadow-lg">
            <h3 className="mb-2 font-bold text-purple-900">
              📝 Content Management Permissions
            </h3>
            <div className="text-purple-800">
              <p className="mb-2">Your current permissions:</p>
              <ul className="list-inside list-disc space-y-1">
                {user?.permissions.includes('write:content') && (
                  <li>Can create and edit content</li>
                )}
                {user?.permissions.includes('approve:content') && (
                  <li>Can approve content for publication</li>
                )}
                {user?.permissions.includes('delete:all') ? (
                  <li>Can delete any content (Admin only)</li>
                ) : (
                  <li className="text-purple-600">
                    ⚠️ Cannot delete content (Admin permission required)
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
