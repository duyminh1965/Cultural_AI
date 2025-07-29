/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { useAI } from './useAI';

export const useChat = () => {
  const { sendChatMessage, analyzeCulturalProfile } = useAI();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Cultural Concierge, powered by advanced cultural intelligence. I'd love to learn about your unique tastes across music, film, cuisine, and fashion to create deeply personalized travel experiences. Let's start with music - what artists, genres, or musical experiences really resonate with your soul?",
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [extractedPreferences, setExtractedPreferences] = useState<any>(null);
 
  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(), 
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get AI response
      const result = await sendChatMessage(content, messages);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Store extracted preferences if available
      if (result.extractedPreferences) {
        setExtractedPreferences(result.extractedPreferences);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Let me try to help you with some general cultural insights while we resolve this.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [sendChatMessage, messages]);

  const completeOnboarding = useCallback(async () => {
    if (extractedPreferences) {
      try {
        const result = await analyzeCulturalProfile(extractedPreferences);
        return result;
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        throw error;
      }
    }
    throw new Error('No preferences extracted yet');
  }, [extractedPreferences, analyzeCulturalProfile]);

  return {
    messages,
    isTyping,
    extractedPreferences,
    sendMessage,
    completeOnboarding,
  };
};