/**
 * AI Trip Planner Service
 * Handles communication with the AI trip planning API
 */

const AI_API_BASE = 'https://nextgencodex-aitripplanner.hf.space';
const API_KEY = 'nextgencodex';

/**
 * Generate a trip plan using AI
 * @param {string} query - User's trip planning query (e.g., "Plan a trip to Colombo")
 * @returns {Promise<Object>} - AI-generated trip plan
 */
export const generateTripPlan = async (query) => {
  try {
    console.log('Sending query to AI API:', query);
    
    const response = await fetch(`${AI_API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({ query }),
      mode: 'cors',
      credentials: 'omit',
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', {
      contentType: response.headers.get('content-type'),
      corsHeader: response.headers.get('access-control-allow-origin'),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.detail?.[0]?.msg || errorData?.message || errorMessage;
      } catch (e) {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('AI API Response:', data);
    return data;
  } catch (error) {
    console.error('AI Trip Planner Error:', error);
    
    // Provide helpful error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('CORS Error: The API server may not allow browser requests. Please check with your backend team.');
    }
    if (error.message.includes('TypeError')) {
      throw new Error(`Network Error: ${error.message}`);
    }
    
    throw new Error(`Failed to generate trip plan: ${error.message}`);
  }
};

/**
 * Generate a customized package recommendation
 * @param {Object} preferences - User preferences object
 * @param {string} preferences.destination - Destination name
 * @param {number} preferences.duration - Trip duration in days
 * @param {string} preferences.interests - User's interests (e.g., "adventure, culture, wildlife")
 * @param {number} preferences.budget - Budget in USD
 * @returns {Promise<Object>} - AI-generated package recommendation
 */
export const generatePackageRecommendation = async (preferences) => {
  const query = `Create a package recommendation with the following preferences:
Destination: ${preferences.destination}
Duration: ${preferences.duration} days
Interests: ${preferences.interests}
Budget: $${preferences.budget}`;

  return generateTripPlan(query);
};

/**
 * Chat with AI trip planner
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous conversation messages (optional)
 * @returns {Promise<Object>} - AI response
 */
export const chatWithAI = async (message, conversationHistory = []) => {
  const contextMessage = conversationHistory.length > 0 
    ? `${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}\nUser: ${message}`
    : message;

  return generateTripPlan(contextMessage);
};

export default {
  generateTripPlan,
  generatePackageRecommendation,
  chatWithAI,
};
