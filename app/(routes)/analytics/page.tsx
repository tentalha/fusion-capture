'use client';

import { AuthGuard } from '@/components/AuthGuard';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Eye,
  Clock,
} from 'lucide-react';

export default function AnalyticsPage() {
  const metrics = [
    {
      label: 'Total Visitors',
      value: '45,234',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      label: 'Page Views',
      value: '123,456',
      change: '+8.3%',
      trend: 'up',
      icon: Eye,
    },
    {
      label: 'Avg. Session',
      value: '4m 32s',
      change: '-2.1%',
      trend: 'down',
      icon: Clock,
    },
    {
      label: 'Engagement Rate',
      value: '68.4%',
      change: '+5.7%',
      trend: 'up',
      icon: Activity,
    },
  ];

  const topPages = [
    { page: '/dashboard', views: 12543, change: '+15%' },
    { page: '/content', views: 9821, change: '+8%' },
    { page: '/profile', views: 7654, change: '+12%' },
    { page: '/analytics', views: 5432, change: '+22%' },
    { page: '/', views: 4321, change: '+6%' },
  ];

  return (
    <AuthGuard requiredPermissions={['view:analytics']}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-2 text-gray-600">
              Comprehensive insights and performance metrics
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const TrendIcon =
                metric.trend === 'up' ? TrendingUp : TrendingDown;
              const trendColor =
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600';

              return (
                <div
                  key={index}
                  className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className={`flex items-center gap-1 ${trendColor}`}>
                      <TrendIcon className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Chart Placeholder */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Traffic Overview
              </h2>
              <div className="flex h-64 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                  <Activity className="mx-auto mb-3 h-12 w-12 text-blue-600" />
                  <p className="font-semibold text-gray-900">
                    Chart Visualization
                  </p>
                  <p className="text-sm text-gray-600">
                    Real chart would be rendered here
                  </p>
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Top Pages
              </h2>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-mono text-sm font-semibold text-gray-900">
                          {page.page}
                        </p>
                        <p className="text-sm text-gray-600">
                          {page.views.toLocaleString()} views
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {page.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Demographics */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                User Demographics
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Desktop</span>
                    <span className="font-semibold text-gray-900">58%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: '58%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Mobile</span>
                    <span className="font-semibold text-gray-900">32%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-purple-600"
                      style={{ width: '32%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Tablet</span>
                    <span className="font-semibold text-gray-900">10%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: '10%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Activity */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Real-time Activity
              </h2>
              <div className="space-y-3">
                {[
                  'User viewed /dashboard',
                  'New content published',
                  'User login from GitHub',
                  'Content edited by editor',
                  'Analytics report generated',
                  'New user registered',
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                  >
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700">{activity}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {index + 1}m ago
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 rounded-xl bg-green-50 p-6 shadow-lg">
            <h3 className="mb-2 font-bold text-green-900">
              📊 Analytics Dashboard
            </h3>
            <p className="text-green-800">
              This analytics page is only accessible to users with the "view:analytics" 
              permission (Admin role). It displays comprehensive insights about user 
              behavior, traffic patterns, and engagement metrics.
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
