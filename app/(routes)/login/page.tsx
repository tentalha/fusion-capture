'use client';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Github, Mail } from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-3xl font-bold text-white">FC</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
            >
              <Mail className="h-5 w-5" />
              Continue with Google
            </button>

            <button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-900 bg-gray-900 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-md"
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="mt-8 rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">Demo Accounts</p>
            <p className="mt-1 text-xs text-blue-700">
              Sign in with any provider. First user gets viewer role. You can
              manually update roles in MongoDB for testing.
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Secure authentication powered by NextAuth.js</p>
          </div>
        </div>
      </div>
    </div>
  );
}
