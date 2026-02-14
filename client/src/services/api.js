import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (username, email, password) => api.post('/auth/signup', { username, email, password }),
  getMe: () => api.get('/auth/me')
};

// Scores API
export const scoresAPI = {
  saveScore: (score, level) => api.post('/scores', { score, level }),
  getUserScores: () => api.get('/scores')
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: () => api.get('/leaderboard')
};

export default api;

