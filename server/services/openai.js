import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  constructor() {
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
  }

  async generateCulturalResponse(userMessage, culturalContext = {}) {
    try {
      const systemPrompt = `You are a sophisticated Cultural Concierge AI with deep knowledge of global culture, arts, cuisine, fashion, and travel. Your role is to:

1. Understand users' cultural preferences through natural conversation
2. Make intelligent connections between different cultural domains (music → cuisine, film → travel, etc.)
3. Provide personalized, authentic cultural recommendations
4. Maintain a warm, knowledgeable, and slightly sophisticated tone

Current user context: ${JSON.stringify(culturalContext)}

Guidelines:
- Ask thoughtful follow-up questions to understand cultural nuances
- Make unexpected but logical connections between cultural preferences
- Suggest authentic, non-touristy experiences
- Reference specific artists, venues, or cultural movements when relevant
- Keep responses conversational but insightful (2-3 sentences max)`;

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate cultural response');
    }
  }

  async analyzeCulturalProfile(preferences) {
    try {
      const prompt = `Analyze this cultural profile and provide insights:

Preferences: ${JSON.stringify(preferences)}

Please provide:
1. 3-4 personality traits based on these preferences
2. 3-4 cultural affinities or movements they'd connect with
3. 2-3 unexpected cultural connections across domains

Format as JSON:
{
  "personalityTraits": ["trait1", "trait2", "trait3"],
  "culturalAffinities": ["affinity1", "affinity2", "affinity3"],
  "crossDomainConnections": [
    {"from": "preference", "to": "cultural_element", "reasoning": "explanation"}
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.6,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI profile analysis error:', error);
      throw new Error('Failed to analyze cultural profile');
    }
  }

  async generateTravelRecommendations(culturalProfile, destination) {
    try {
      const prompt = `Based on this cultural profile, generate specific travel recommendations for ${destination}:

Cultural Profile: ${JSON.stringify(culturalProfile)}

Provide 3-5 specific recommendations including:
- Restaurants that match their taste
- Cultural activities/venues
- Shopping or local experiences
- Hidden gems only locals know

Format as JSON array:
[
  {
    "type": "restaurant|activity|shopping|accommodation",
    "title": "Name",
    "description": "Brief description",
    "location": "Specific address or area",
    "culturalMatch": 0.85,
    "tags": ["tag1", "tag2"],
    "reasoning": "Why this matches their cultural profile"
  }
]`;

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI travel recommendations error:', error);
      throw new Error('Failed to generate travel recommendations');
    }
  }

  async extractCulturalPreferences(conversationHistory) {
    try {
      const prompt = `Extract cultural preferences from this conversation:

Conversation: ${JSON.stringify(conversationHistory)}

Identify specific preferences in these categories:
- Music (artists, genres, styles)
- Film (directors, genres, movements)
- Cuisine (types, styles, specific restaurants/chefs)
- Fashion (brands, styles, aesthetics)
- Travel (types of experiences, destinations)

Format as JSON:
{
  "music": ["preference1", "preference2"],
  "film": ["preference1", "preference2"],
  "cuisine": ["preference1", "preference2"],
  "fashion": ["preference1", "preference2"],
  "travel": ["preference1", "preference2"]
}`;

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.5,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI preference extraction error:', error);
      throw new Error('Failed to extract cultural preferences');
    }
  }
}

export default new OpenAIService();