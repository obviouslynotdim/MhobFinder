// src/services/api/client.js
import axios from 'axios';
import { auth } from '../../firebase.js';

const API_ROOT = (import.meta.env.VITE_API_BASE || 'http://localhost:5000').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: `${API_ROOT}/api`,
});

// Add Firebase token to requests
apiClient.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;