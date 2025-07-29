/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserPreferences {
  music: string[];
  film: string[];
  cuisine: string[];
  fashion: string[];
  travel: string[];
}

export interface CulturalProfile {
  id: string;
  userId: string;
  preferences: UserPreferences;
  tasteMap: TasteConnection[];
  tasteData: TasteData[];
  personalityTraits: string[];
  culturalAffinities: string[];
  completedOnboarding: boolean;
  lastUpdated: Date;
}

export interface TasteConnection {  
  from: string;
  to: string;
  strength: number;
  domain: string;
}

export interface TasteData {
  name: string;
  value: number;
  color: string;
}

export interface Recommendation {
  id: string;
  type: 'restaurant' | 'activity' | 'event' | 'accommodation' | 'shopping';
  title: string;
  description: string;
  location: string;
  culturalMatch: number;
  imageUrl: string;
  tags: string[];
  reasoning: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  culturalMatch: number;
  description: string;
  imageUrl: string;
  highlights: string[];
  recommendations: Recommendation[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  typing?: boolean;
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'interaction' | 'conversion' | 'engagement';
  action: string;
  data?: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

export interface VisitorSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  pageViews: number;
  interactions: number;
  culturalPreferences?: string[];
  completedOnboarding: boolean;
  viewedDestinations: string[];
  location?: {
    country: string;
    city: string;
  };
}

export interface AnalyticsMetrics {
  totalVisitors: number;
  activeUsers: number;
  avgSessionDuration: number;
  onboardingCompletionRate: number;
  topCulturalPreferences: Array<{ preference: string; count: number }>;
  popularDestinations: Array<{ destination: string; views: number }>;
  engagementMetrics: {
    chatMessages: number;
    profileViews: number;
    recommendationClicks: number;
  };
  geographicData: Array<{ country: string; visitors: number }>;
  realTimeUsers: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'moderator';
  avatar?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  culturalProfile?: CulturalProfile;
  preferences?: {
    notifications: boolean;
    privacy: 'public' | 'private' | 'friends';
    language: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserManagementFilters {
  role?: 'user' | 'admin' | 'moderator';
  status?: 'active' | 'inactive';
  search?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
}