'use client';

import Link from 'next/link';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 shadow-lg">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="mb-4 text-6xl font-bold text-gray-900">403</h1>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Access Denied
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Sorry, you don't have permission to access this page.
        </p>

        {user && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 font-bold text-gray-900">Your Current Role</h3>
            <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 font-bold text-white shadow">
              {user.role?.toUpperCase()}
            </div>
            <p className="text-gray-600">
              Your current role doesn't have sufficient permissions to view this
              content. Contact an administrator if you believe this is an error.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow transition-all hover:border-gray-400 hover:shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
        </div>

        <div className="mt-12 rounded-2xl bg-blue-50 p-6 shadow-xl">
          <h3 className="mb-2 font-bold text-blue-900">
            🔒 Role-Based Access Control
          </h3>
          <p className="text-blue-800">
            This application uses comprehensive authorization. Different pages
            and features are available based on your assigned role and
            permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
