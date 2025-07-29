
import { CulturalProfileOne } from '@/database/action/culturalProfile.action';
import { extractCulturalPreferences, getChatMessage } from '@/server/actions/openai';
import { CulturalProfile } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

// Chat with AI Cultural Concierge
export async function POST(req: NextRequest) {
  try {
    console.log("da den day")  ;  
    const { message, userId, conversationHistory = [] } = await req.json();
    
    const culturalProfile = await CulturalProfileOne(userId) as CulturalProfile;
    const culturalContext = culturalProfile ? {
      preferences: culturalProfile.preferences,
      personalityTraits: culturalProfile.personalityTraits,
      culturalAffinities: culturalProfile.culturalAffinities,
    } : {};

    // Generate AI response
    const response = await getChatMessage(message, culturalContext);

    // Extract preferences if this is an onboarding conversation
    let extractedPreferences = null;
    if (conversationHistory.length >= 2) {
      try {
        extractedPreferences = await extractCulturalPreferences(
          [...conversationHistory, { role: 'user', content: message }]
        );
      } catch (error) {
        console.warn('Failed to extract preferences:', error);
      }
    }

    return NextResponse.json({
      response,
      extractedPreferences,
      conversationLength: conversationHistory.length + 1,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ message: 'Failed to generate AI response' });
  }
};