import express from 'express';
import CulturalProfile from '../models/CulturalProfile.js';
import Destination from '../models/Destination.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user's cultural profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    let profile = await CulturalProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      // Create default profile if none exists
      profile = new CulturalProfile({
        userId: req.user._id,
        preferences: {
          music: [],
          film: [],
          cuisine: [],
          fashion: [],
          travel: []
        },
        tasteMap: [],
        personalityTraits: [],
        culturalAffinities: [],
        completedOnboarding: false
      });
      await profile.save();
    }

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cultural profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { preferences, personalityTraits, culturalAffinities, completedOnboarding } = req.body;
    
    let profile = await CulturalProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      profile = new CulturalProfile({ userId: req.user._id });
    }

    if (preferences) {
      profile.preferences = { ...profile.preferences, ...preferences };
    }
    
    if (personalityTraits) {
      profile.personalityTraits = personalityTraits;
    }
    
    if (culturalAffinities) {
      profile.culturalAffinities = culturalAffinities;
    }
    
    if (typeof completedOnboarding === 'boolean') {
      profile.completedOnboarding = completedOnboarding;
    }

    profile.lastUpdated = new Date();
    await profile.save();

    res.json({
      message: 'Cultural profile updated successfully',
      profile
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get destinations
router.get('/destinations', authenticate, async (req, res) => {
  try {
    const { limit = 10, country, culturalTags } = req.query;
    
    const query = { isActive: true };
    
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    
    if (culturalTags) {
      const tags = Array.isArray(culturalTags) ? culturalTags : [culturalTags];
      query.culturalTags = { $in: tags };
    }

    const destinations = await Destination.find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({ destinations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get destination by ID
router.get('/destinations/:id', authenticate, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json({ destination });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get personalized recommendations
router.get('/recommendations', authenticate, async (req, res) => {
  try {
    const { location, type, limit = 5 } = req.query;
    
    // Get user's cultural profile
    const profile = await CulturalProfile.findOne({ userId: req.user._id });
    
    if (!profile || !profile.completedOnboarding) {
      return res.status(400).json({ 
        message: 'Please complete your cultural profile first' 
      });
    }

    // Find destinations that match user's cultural preferences
    const culturalTags = [
      ...profile.culturalAffinities,
      ...profile.personalityTraits
    ];

    const query = { isActive: true };
    
    if (culturalTags.length > 0) {
      query.culturalTags = { $in: culturalTags };
    }

    const destinations = await Destination.find(query).limit(parseInt(limit));
    
    // Extract recommendations from destinations
    let recommendations = [];
    destinations.forEach(destination => {
      destination.recommendations.forEach(rec => {
        recommendations.push({
          ...rec.toObject(),
          destinationName: destination.name,
          destinationCountry: destination.country
        });
      });
    });

    // Filter by type if specified
    if (type) {
      recommendations = recommendations.filter(rec => rec.type === type);
    }

    // Sort by cultural match and limit results
    recommendations.sort((a, b) => b.culturalMatch - a.culturalMatch);
    recommendations = recommendations.slice(0, parseInt(limit));

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;