import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://rightspeak-api.vercel.app',
});

// Add interceptor to include AppID token
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('rightspeak_user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.tokens && user.tokens.accessToken) {
      config.headers.Authorization = `Bearer ${user.tokens.accessToken}`;
    }
  }
  return config;
});

export const askQuestion = async (query) => {
  const response = await api.post('/ask', { query });
  return response.data;
};

export default api;
