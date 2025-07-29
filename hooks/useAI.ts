/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { ChatMessage, CulturalProfile, Recommendation } from '../types';
import { analyzeCulturalProfile } from '@/server/actions/openai';
import { UpdateCulturalProfile } from '@/database/action/culturalProfile.action';
import { useUser } from '@clerk/nextjs';

const API_BASE_URL = '/api';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useUser();
  const userId = user?.id || '';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('cultural_concierge_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  const sendChatMessage = useCallback(async (
    message: string, 
    conversationHistory: ChatMessage[] = []
  ): Promise<{ response: string; extractedPreferences?: any }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message,
          userId,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send chat message');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const analyzeCulturalProfile = useCallback(async (preferences: any): Promise<{
    profile: CulturalProfile;
    aiInsights: any;
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      // const response = await fetch(`${API_BASE_URL}/ai/analyze-profile`, {
      //   method: 'POST',
      //   headers: getAuthHeaders(),
      //   body: JSON.stringify({ preferences }),
      // });

      const response = await useAnalyzerProfile(preferences, userId);

      if (!response.ok) {
        throw new Error('Failed to analyze cultural profile');
      }

      const data = response;
      return {profile: data.profile as CulturalProfile, aiInsights: data.aiInsights};
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const getTravelRecommendations = useCallback(async (
    destination: string,
    preferences?: any
  ): Promise<{ recommendations: Recommendation[] }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/travel-recommendations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ destination, preferences }),
      });

      if (!response.ok) {
        throw new Error('Failed to get travel recommendations');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDestinationSuggestions = useCallback(async (): Promise<{
    destinations: any[];
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/destination-suggestions`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to get destination suggestions');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getLiveRecommendations = useCallback(async (
    location: string,
    category: string = 'all'
  ): Promise<{ recommendations: Recommendation[] }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/live-recommendations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ location, category }),
      });

      if (!response.ok) {
        throw new Error('Failed to get live recommendations');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    sendChatMessage,
    analyzeCulturalProfile,
    getTravelRecommendations,
    getDestinationSuggestions,
    getLiveRecommendations,
  };
};

export default useAI;

const useAnalyzerProfile = async(preferences: any, userId: string) => {
    try {
      
      // Get AI analysis
      const aiAnalysis = await analyzeCulturalProfile(preferences); 
      if (!aiAnalysis.ok) return { message: 'Failed to analyze cultural profile', ok: false };
      const aiAnalysisOn = aiAnalysis.data; 
      
      // // Get Qloo taste profile
      // const qlooProfile = await QlooService.getTasteProfile(preferences);
      
      // // Get cultural connections
      // const connections = await QlooService.getCulturalConnections(preferences);
  
      // Update or create cultural profile
      
      
      const profile = await UpdateCulturalProfile({ userId, aiAnalysis: aiAnalysisOn, preferences });
  
      return ({
        message: 'Cultural profile analyzed and updated',
        profile,
        aiInsights: aiAnalysisOn,
        ok: true,
      });
    } catch (error) {
      console.error('Profile analysis error:', error);
      return { message: 'Failed to analyze cultural profile', ok: false };
    }
  };



