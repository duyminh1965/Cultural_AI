import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class QlooService {
  constructor() {
    this.apiKey = process.env.QLOO_API_KEY;
    this.baseURL = process.env.QLOO_API_URL || 'https://api.qloo.com/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getTasteProfile(preferences) {
    try {
      // Convert our preferences to Qloo format
      const qlooInputs = this.formatPreferencesForQloo(preferences);

      const response = await this.client.post('/taste/profile', {
        inputs: qlooInputs,
        options: {
          include_metadata: true,
          max_results: 50,
        },
      });

      return this.parseQlooTasteProfile(response.data);
    } catch (error) {
      console.error('Qloo taste profile error:', error);
      // Return fallback data if Qloo is unavailable
      return this.generateFallbackTasteProfile(preferences);
    }
  }

  async getRecommendations(tasteProfile, category, location = null) {
    try {
      const payload = {
        taste_profile: tasteProfile,
        category: category, // 'restaurants', 'music', 'movies', 'fashion', 'travel'
        options: {
          max_results: 10,
          include_metadata: true,
          location: location,
        },
      };

      const response = await this.client.post('/recommendations', payload);
      return this.parseQlooRecommendations(response.data, category);
    } catch (error) {
      console.error('Qloo recommendations error:', error);
      return this.generateFallbackRecommendations(category, location);
    }
  }

  async getCulturalConnections(preferences) {
    try {
      const response = await this.client.post('/taste/connections', {
        inputs: this.formatPreferencesForQloo(preferences),
        options: {
          connection_types: ['cross_domain', 'cultural_affinity'],
          strength_threshold: 0.6,
        },
      });

      return this.parseQlooConnections(response.data);
    } catch (error) {
      console.error('Qloo cultural connections error:', error);
      return this.generateFallbackConnections(preferences);
    }
  }

  async getDestinationRecommendations(culturalProfile, travelPreferences) {
    try {
      const response = await this.client.post('/travel/destinations', {
        cultural_profile: culturalProfile,
        travel_style: travelPreferences,
        options: {
          max_results: 5,
          include_cultural_match: true,
          include_local_recommendations: true,
        },
      });

      return this.parseQlooDestinations(response.data);
    } catch (error) {
      console.error('Qloo destination recommendations error:', error);
      return this.generateFallbackDestinations(culturalProfile);
    }
  }

  formatPreferencesForQloo(preferences) {
    const inputs = [];
    
    Object.entries(preferences).forEach(([domain, items]) => {
      items.forEach(item => {
        inputs.push({
          type: domain,
          name: item,
          weight: 1.0,
        });
      });
    });

    return inputs;
  }

  parseQlooTasteProfile(data) {
    return {
      taste_vectors: data.taste_vectors || {},
      cultural_dimensions: data.cultural_dimensions || {},
      personality_traits: data.personality_traits || [],
      cultural_affinities: data.cultural_affinities || [],
    };
  }

  parseQlooRecommendations(data, category) {
    return data.results?.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      category: category,
      cultural_match: item.cultural_match || 0.8,
      metadata: item.metadata || {},
      reasoning: item.reasoning || 'Recommended based on your cultural profile',
    })) || [];
  }

  parseQlooConnections(data) {
    return data.connections?.map(conn => ({
      from: conn.source,
      to: conn.target,
      strength: conn.strength,
      domain: conn.connection_type,
      reasoning: conn.explanation,
    })) || [];
  }

  parseQlooDestinations(data) {
    return data.destinations?.map(dest => ({
      name: dest.name,
      country: dest.country,
      cultural_match: dest.cultural_match,
      description: dest.description,
      highlights: dest.cultural_highlights || [],
      local_recommendations: dest.local_recommendations || [],
    })) || [];
  }

  // Fallback methods when Qloo API is unavailable
  generateFallbackTasteProfile(preferences) {
    return {
      taste_vectors: {},
      cultural_dimensions: {
        authenticity: 0.8,
        sophistication: 0.7,
        creativity: 0.9,
      },
      personality_traits: ['Authentic', 'Creative', 'Sophisticated'],
      cultural_affinities: ['Independent Culture', 'Artisan Communities'],
    };
  }

  generateFallbackRecommendations(category, location) {
    const fallbackData = {
      restaurants: [
        {
          id: 'fallback_1',
          name: 'Local Artisan Eatery',
          description: 'Farm-to-table restaurant with local ingredients',
          category: 'restaurants',
          cultural_match: 0.85,
          reasoning: 'Matches your preference for authentic, quality experiences',
        },
      ],
      music: [
        {
          id: 'fallback_2',
          name: 'Indie Folk Venue',
          description: 'Intimate venue featuring emerging artists',
          category: 'music',
          cultural_match: 0.9,
          reasoning: 'Aligns with your indie music preferences',
        },
      ],
    };

    return fallbackData[category] || [];
  }

  generateFallbackConnections(preferences) {
    return [
      {
        from: 'Indie Folk',
        to: 'Nordic Cuisine',
        strength: 0.85,
        domain: 'Music → Cuisine',
        reasoning: 'Both emphasize authenticity and craftsmanship',
      },
    ];
  }

  generateFallbackDestinations(culturalProfile) {
    return [
      {
        name: 'Copenhagen',
        country: 'Denmark',
        cultural_match: 0.94,
        description: 'Perfect blend of hygge culture and innovative design',
        highlights: ['Nordic Design', 'Sustainable Living', 'Indie Culture'],
        local_recommendations: [],
      },
    ];
  }
}

export default new QlooService();