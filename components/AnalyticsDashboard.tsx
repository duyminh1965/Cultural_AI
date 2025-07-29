import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Globe, 
  MessageCircle,
  MousePointer,
  Target,
  Activity,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { useAnalyticsMetrics } from '../hooks/useAnalytics';

export const AnalyticsDashboard: React.FC = () => {
  const { metrics, isLoading, error, refetch } = useAnalyticsMetrics();
  const [isRealTime, setIsRealTime] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      refetch();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isRealTime, refetch]);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    icon: React.ElementType;
    color: string;
  }> = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        {change && (
          <span className="text-sm text-green-600 font-medium">{change}</span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm text-slate-600">{title}</p>
    </motion.div>
  );

  const COLORS = ['#0ea5e9', '#e8b932', '#7f8859', '#b07c17', '#0284c7', '#d19a1a'];

  if (isLoading && !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Error Loading Analytics</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">No Analytics Data</h2>
          <p className="text-slate-600">No analytics data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-slate-600">
              Real-time insights into cultural discovery patterns
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-slate-600">
                {isRealTime ? 'Live' : 'Paused'}
              </span>
            </div>
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{isRealTime ? 'Pause' : 'Resume'} Live Updates</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Visitors"
          value={metrics.totalVisitors.toLocaleString()}
          change="+12.5%"
          icon={Users}
          color="primary"
        />
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers}
          change="+8.2%"
          icon={Activity}
          color="cultural"
        />
        <MetricCard
          title="Avg Session Duration"
          value={`${metrics.avgSessionDuration}m`}
          change="+15.3%"
          icon={Clock}
          color="earth"
        />
        <MetricCard
          title="Onboarding Rate"
          value={`${Math.round(metrics.onboardingCompletionRate * 100)}%`}
          change="+5.7%"
          icon={Target}
          color="primary"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Cultural Preferences */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
            Top Cultural Preferences
          </h2>
          {metrics.topCulturalPreferences.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.topCulturalPreferences}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="preference" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500">
              No cultural preferences data available yet
            </div>
          )}
        </motion.div>

        {/* Popular Destinations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-cultural-600" />
            Popular Destinations
          </h2>
          {metrics.popularDestinations.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics.popularDestinations}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="views"
                  >
                    {metrics.popularDestinations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {metrics.popularDestinations.slice(0, 4).map((item, index) => (
                  <div key={item.destination} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm text-slate-700">{item.destination}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500">
              No destination data available yet
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Engagement Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-earth-600" />
            Engagement
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-primary-600" />
                <span className="text-slate-700">Chat Messages</span>
              </div>
              <span className="font-semibold text-slate-900">
                {metrics.engagementMetrics.chatMessages.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-cultural-600" />
                <span className="text-slate-700">Profile Views</span>
              </div>
              <span className="font-semibold text-slate-900">
                {metrics.engagementMetrics.profileViews.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <MousePointer className="h-5 w-5 text-earth-600" />
                <span className="text-slate-700">Recommendation Clicks</span>
              </div>
              <span className="font-semibold text-slate-900">
                {metrics.engagementMetrics.recommendationClicks.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Real-time Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-gradient-to-r from-primary-50 to-cultural-50 rounded-3xl p-6 border border-primary-200/50"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary-600" />
            Real-time Activity
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {metrics.realTimeUsers}
              </div>
              <p className="text-sm text-slate-600">Users online now</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cultural-600 mb-1">
                {Math.round(metrics.onboardingCompletionRate * 100)}%
              </div>
              <p className="text-sm text-slate-600">Completing onboarding</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-earth-600 mb-1">
                {metrics.avgSessionDuration}m
              </div>
              <p className="text-sm text-slate-600">Average session time</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};