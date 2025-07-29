import { useState, useEffect, useCallback } from 'react';
import { AnalyticsEvent, VisitorSession, AnalyticsMetrics } from '../types';

const API_BASE_URL = '/api';

// Generate a unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('cultural_concierge_session');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('cultural_concierge_session', sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  const [sessionId] = useState(getSessionId());
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [currentSession, setCurrentSession] = useState<VisitorSession>({
    id: sessionId,
    startTime: new Date(),
    pageViews: 0,
    interactions: 0,
    completedOnboarding: false,
    viewedDestinations: [],
  });

  // Get auth token for tracking
  const getAuthToken = () => {
    return localStorage.getItem('cultural_concierge_token');
  };

  // Send event to backend
  const sendEvent = useCallback(async (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => {
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...event,
          sessionId,
        }),
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }, [sessionId]);

  // Track page view
  const trackPageView = useCallback((page: string, data?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'page_view',
      action: `view_${page}`,
      data,
      timestamp: new Date(),
      sessionId,
    };

    setEvents(prev => [...prev, event]);
    setCurrentSession(prev => ({
      ...prev,
      pageViews: prev.pageViews + 1,
    }));

    // Send to backend
    sendEvent(event);
  }, [sessionId, sendEvent]);

  // Track user interaction
  const trackInteraction = useCallback((action: string, data?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'interaction',
      action,
      data,
      timestamp: new Date(),
      sessionId,
    };

    setEvents(prev => [...prev, event]);
    setCurrentSession(prev => ({
      ...prev,
      interactions: prev.interactions + 1,
    }));

    // Send to backend
    sendEvent(event);
  }, [sessionId, sendEvent]);

  // Track conversion events
  const trackConversion = useCallback((action: string, data?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'conversion',
      action,
      data,
      timestamp: new Date(),
      sessionId,
    };

    setEvents(prev => [...prev, event]);
    
    if (action === 'onboarding_completed') {
      setCurrentSession(prev => ({
        ...prev,
        completedOnboarding: true,
        culturalPreferences: data?.preferences || [],
      }));
    }

    // Send to backend
    sendEvent(event);
  }, [sessionId, sendEvent]);

  // Track engagement
  const trackEngagement = useCallback((action: string, data?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'engagement',
      action,
      data,
      timestamp: new Date(),
      sessionId,
    };

    setEvents(prev => [...prev, event]);

    // Send to backend
    sendEvent(event);
  }, [sessionId, sendEvent]);

  // Track destination view
  const trackDestinationView = useCallback((destinationId: string, destinationName: string) => {
    trackPageView('destination', { destinationId, destinationName });
    setCurrentSession(prev => ({
      ...prev,
      viewedDestinations: [...new Set([...prev.viewedDestinations, destinationId])],
    }));
  }, [trackPageView]);

  // Initialize session tracking
  useEffect(() => {
    trackPageView('app_start');
    
    // Track session end on page unload
    const handleBeforeUnload = () => {
      setCurrentSession(prev => ({
        ...prev,
        endTime: new Date(),
      }));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackPageView]);

  return {
    sessionId,
    events,
    currentSession,
    trackPageView,
    trackInteraction,
    trackConversion,
    trackEngagement,
    trackDestinationView,
  };
};

// Hook for fetching analytics metrics (admin/moderator only)
export const useAnalyticsMetrics = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('cultural_concierge_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${API_BASE_URL}/analytics/metrics?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics metrics');
      }

      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setMetrics(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refetch: fetchMetrics,
  };
};