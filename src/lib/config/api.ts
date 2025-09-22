/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    
    // Card endpoints
    CARDS: `${API_BASE_URL}/api/cards`,
    CARD_IMAGE: (cardId: string) => `${API_BASE_URL}/api/cards/${cardId}/image`,
  }
} as const;

export default API_CONFIG;