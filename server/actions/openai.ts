/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { OpenAI } from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAI();

export const getChatMessage = async (userMessage : string, culturalContext = {}) => {
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

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    });

    return response.output_text;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate cultural response");
  }
};

export const extractCulturalPreferences = async (conversationHistory : any) => {
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
    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    });

    return JSON.parse(response.output_text);
  } catch (error) {
    console.error("OpenAI preference extraction error:", error);
    throw new Error("Failed to extract cultural preferences");
  }
};

export const analyzeCulturalProfile = async (preferences: any) => {
    try {
      const prompt = `Analyze this cultural profile and provide insights:

Preferences: ${JSON.stringify(preferences)}

Please provide:
1. 3-4 personality traits based on these preferences
2. 3-4 cultural affinities or movements they'd connect with
3. 2-3 unexpected cultural connections across domains

Only => Format as JSON:
{
  "personalityTraits": ["trait1", "trait2", "trait3"],
  "culturalAffinities": ["affinity1", "affinity2", "affinity3"],
  "crossDomainConnections": [
    {"from": "preference", "to": "cultural_element", "reasoning": "explanation"}
  ],
  "connections":[
    { "from": "Bon Iver", "to": "Copenhagen", "strength": 0.92, "domain": "Music → Travel" },
  ...
  ],
  "tasteData":[
    { name, value:%, color }
  ]
}`;

      const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    });
    console.log('OpenAI response:', response.output_text  );
    const rawOutput = response.output_text; // The string starting with json\n{...}
    const cleaned = rawOutput.replace(/```json\n?/, '').replace(/```$/, '');
    const data = JSON.parse(cleaned);

      return {ok: true, data: data};
    } catch (error) {
      console.error('OpenAI profile analysis error:', error);
      //throw new Error('Failed to analyze cultural profile');
      return {ok: false, data:'OpenAI profile analysis error:'+ error}
    }
  }
  
