import { AnalyticsMetrics, VisitorSession } from '../types';

// Mock real-time analytics data
export const mockAnalyticsMetrics: AnalyticsMetrics = {
  totalVisitors: 2847,
  activeUsers: 23,
  avgSessionDuration: 4.2, // minutes
  onboardingCompletionRate: 0.68,
  topCulturalPreferences: [
    { preference: 'Indie Folk', count: 342 },
    { preference: 'Nordic Cuisine', count: 298 },
    { preference: 'Independent Cinema', count: 267 },
    { preference: 'Sustainable Fashion', count: 234 },
    { preference: 'Artisanal Coffee', count: 189 },
    { preference: 'Nature Photography', count: 156 },
  ],
  popularDestinations: [
    { destination: 'Copenhagen', views: 1247 },
    { destination: 'Scottish Highlands', views: 892 },
    { destination: 'Portland', views: 743 },
    { destination: 'Reykjavik', views: 567 },
    { destination: 'Melbourne', views: 445 },
  ],
  engagementMetrics: {
    chatMessages: 8934,
    profileViews: 1876,
    recommendationClicks: 3421,
  },
  geographicData: [
    { country: 'United States', visitors: 1247 },
    { country: 'United Kingdom', visitors: 432 },
    { country: 'Canada', visitors: 298 },
    { country: 'Denmark', visitors: 234 },
    { country: 'Germany', visitors: 189 },
    { country: 'Australia', visitors: 156 },
    { country: 'Netherlands', visitors: 134 },
    { country: 'Sweden', visitors: 98 },
  ],
  realTimeUsers: 23,
};

// Mock recent sessions for real-time tracking
export const mockRecentSessions: VisitorSession[] = [
  {
    id: 'session_1',
    startTime: new Date(Date.now() - 300000), // 5 minutes ago
    pageViews: 8,
    interactions: 12,
    completedOnboarding: true,
    viewedDestinations: ['copenhagen', 'portland'],
    culturalPreferences: ['Indie Folk', 'Nordic Cuisine'],
    location: { country: 'United States', city: 'San Francisco' },
  },
  {
    id: 'session_2',
    startTime: new Date(Date.now() - 180000), // 3 minutes ago
    pageViews: 4,
    interactions: 6,
    completedOnboarding: false,
    viewedDestinations: ['scottish-highlands'],
    location: { country: 'United Kingdom', city: 'London' },
  },
  {
    id: 'session_3',
    startTime: new Date(Date.now() - 120000), // 2 minutes ago
    pageViews: 12,
    interactions: 18,
    completedOnboarding: true,
    viewedDestinations: ['copenhagen', 'scottish-highlands', 'portland'],
    culturalPreferences: ['Independent Cinema', 'Sustainable Fashion'],
    location: { country: 'Canada', city: 'Toronto' },
  },
];

// Generate real-time updates
export const generateRealTimeUpdate = (): Partial<AnalyticsMetrics> => {
  const variance = () => Math.random() * 0.2 - 0.1; // ±10% variance
  
  return {
    activeUsers: Math.max(1, Math.round(mockAnalyticsMetrics.activeUsers * (1 + variance()))),
    realTimeUsers: Math.max(1, Math.round(mockAnalyticsMetrics.realTimeUsers * (1 + variance()))),
    totalVisitors: mockAnalyticsMetrics.totalVisitors + Math.floor(Math.random() * 3),
  };
};