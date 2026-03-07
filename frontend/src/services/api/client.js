// src/services/api/client.js
import axios from 'axios';
import { auth } from '../../firebase.js';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust to your backend URL
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