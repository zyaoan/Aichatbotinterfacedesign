// API Configuration
// Update these values based on your environment

export const API_CONFIG = {
  // Base URL for the FastAPI backend
  // In development: http://localhost:8000
  // In production: your deployed backend URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // API endpoints
  ENDPOINTS: {
    CHAT: '/chat',
    QUERY: '/query',
    UPLOAD: '/upload',
    HISTORY: '/history',
    SESSIONS: '/sessions',
  },
  
  // Request timeout (in milliseconds)
  TIMEOUT: 30000,
};

// Helper to get full endpoint URL
export const getEndpointUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
