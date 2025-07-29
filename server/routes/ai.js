import express from 'express';
import OpenAIService from '../services/openai.js';
import QlooService from '../services/qloo.js';
import CulturalProfile from '../models/CulturalProfile.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Chat with AI Cultural Concierge
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    // Get user's cultural context
    const culturalProfile = await CulturalProfile.findOne({ userId: req.user._id });
    const culturalContext = culturalProfile ? {
      preferences: culturalProfile.preferences,
      personalityTraits: culturalProfile.personalityTraits,
      culturalAffinities: culturalProfile.culturalAffinities,
    } : {};

    // Generate AI response
    const response = await OpenAIService.generateCulturalResponse(message, culturalContext);

    // Extract preferences if this is an onboarding conversation
    let extractedPreferences = null;
    if (conversationHistory.length >= 2) {
      try {
        extractedPreferences = await OpenAIService.extractCulturalPreferences(
          [...conversationHistory, { role: 'user', content: message }]
        );
      } catch (error) {
        console.warn('Failed to extract preferences:', error.message);
      }
    }

    res.json({
      response,
      extractedPreferences,
      conversationLength: conversationHistory.length + 1,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Failed to generate AI response' });
  }
});

// Analyze and enhance cultural profile with AI
router.post('/analyze-profile', authenticate, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // Get AI analysis
    const aiAnalysis = await OpenAIService.analyzeCulturalProfile(preferences);
    
    // Get Qloo taste profile
    const qlooProfile = await QlooService.getTasteProfile(preferences);
    
    // Get cultural connections
    const connections = await QlooService.getCulturalConnections(preferences);

    // Update or create cultural profile
    let profile = await CulturalProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      profile = new CulturalProfile({ userId: req.user._id });
    }

    // Merge AI insights with existing profile
    profile.preferences = { ...profile.preferences, ...preferences };
    profile.personalityTraits = aiAnalysis.personalityTraits || profile.personalityTraits;
    profile.culturalAffinities = aiAnalysis.culturalAffinities || profile.culturalAffinities;
    profile.tasteMap = connections.map(conn => ({
      from: conn.from,
      to: conn.to,
      strength: conn.strength,
      domain: conn.domain,
    }));
    profile.completedOnboarding = true;
    profile.lastUpdated = new Date();

    await profile.save();

    res.json({
      message: 'Cultural profile analyzed and updated',
      profile,
      aiInsights: aiAnalysis,
      qlooProfile,
    });
  } catch (error) {
    console.error('Profile analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze cultural profile' });
  }
});

// Get AI-powered travel recommendations
router.post('/travel-recommendations', authenticate, async (req, res) => {
  try {
    const { destination, preferences } = req.body;
    
    // Get user's cultural profile
    const culturalProfile = await CulturalProfile.findOne({ userId: req.user._id });
    
    if (!culturalProfile) {
      return res.status(400).json({ message: 'Please complete your cultural profile first' });
    }

    // Generate AI recommendations
    const aiRecommendations = await OpenAIService.generateTravelRecommendations(
      culturalProfile,
      destination
    );

    // Get Qloo recommendations for different categories
    const qlooRestaurants = await QlooService.getRecommendations(
      culturalProfile,
      'restaurants',
      destination
    );

    const qlooActivities = await QlooService.getRecommendations(
      culturalProfile,
      'activities',
      destination
    );

    // Combine and format recommendations
    const combinedRecommendations = [
      ...aiRecommendations,
      ...qlooRestaurants.map(r => ({
        type: 'restaurant',
        title: r.name,
        description: r.description,
        location: destination,
        culturalMatch: r.cultural_match,
        tags: ['AI Recommended', 'Qloo Powered'],
        reasoning: r.reasoning,
      })),
      ...qlooActivities.map(a => ({
        type: 'activity',
        title: a.name,
        description: a.description,
        location: destination,
        culturalMatch: a.cultural_match,
        tags: ['AI Recommended', 'Qloo Powered'],
        reasoning: a.reasoning,
      })),
    ];

    // Sort by cultural match
    combinedRecommendations.sort((a, b) => b.culturalMatch - a.culturalMatch);

    res.json({
      destination,
      recommendations: combinedRecommendations.slice(0, 10), // Top 10
      totalRecommendations: combinedRecommendations.length,
    });
  } catch (error) {
    console.error('Travel recommendations error:', error);
    res.status(500).json({ message: 'Failed to generate travel recommendations' });
  }
});

// Get AI-powered destination suggestions
router.get('/destination-suggestions', authenticate, async (req, res) => {
  try {
    const culturalProfile = await CulturalProfile.findOne({ userId: req.user._id });
    
    if (!culturalProfile) {
      return res.status(400).json({ message: 'Please complete your cultural profile first' });
    }

    // Get Qloo destination recommendations
    const destinations = await QlooService.getDestinationRecommendations(
      culturalProfile,
      culturalProfile.preferences.travel || []
    );

    res.json({
      destinations,
      basedOn: {
        preferences: culturalProfile.preferences,
        personalityTraits: culturalProfile.personalityTraits,
        culturalAffinities: culturalProfile.culturalAffinities,
      },
    });
  } catch (error) {
    console.error('Destination suggestions error:', error);
    res.status(500).json({ message: 'Failed to get destination suggestions' });
  }
});

// Get real-time cultural recommendations based on location
router.post('/live-recommendations', authenticate, async (req, res) => {
  try {
    const { location, category = 'all' } = req.body;
    
    const culturalProfile = await CulturalProfile.findOne({ userId: req.user._id });
    
    if (!culturalProfile) {
      return res.status(400).json({ message: 'Please complete your cultural profile first' });
    }

    const categories = category === 'all' 
      ? ['restaurants', 'activities', 'shopping', 'music'] 
      : [category];

    const recommendations = [];

    for (const cat of categories) {
      const qlooRecs = await QlooService.getRecommendations(
        culturalProfile,
        cat,
        location
      );
      
      recommendations.push(...qlooRecs.map(rec => ({
        id: rec.id,
        type: cat,
        title: rec.name,
        description: rec.description,
        location: location,
        culturalMatch: rec.cultural_match,
        tags: ['Live', 'Nearby', 'AI Powered'],
        reasoning: rec.reasoning,
        imageUrl: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg`,
      })));
    }

    // Sort by cultural match and limit results
    recommendations.sort((a, b) => b.culturalMatch - a.culturalMatch);

    res.json({
      location,
      recommendations: recommendations.slice(0, 5),
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Live recommendations error:', error);
    res.status(500).json({ message: 'Failed to get live recommendations' });
  }
});

export default router;