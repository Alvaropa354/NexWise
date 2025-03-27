// Configuración de la API
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.nexwise.com';
export const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

// Configuración de endpoints
export const ENDPOINTS = {
  analyze: '/analyze',
  // Otros endpoints que puedas necesitar
};

// Configuración de la API para el análisis de mercado
export const MARKET_STUDY_CONFIG = {
  temperature: 0.7,
  max_tokens: 1000,
  model: 'gemini-pro' // o el modelo que estés utilizando
}; 