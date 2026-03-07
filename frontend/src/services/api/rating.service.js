// src/services/api/rating.service.js
import apiClient from './client.js';

export const getRatingsByFood = async (foodId) => {
  const response = await apiClient.get(`/ratings/foods/${foodId}`);
  return response.data;
};

export const addOrUpdateRating = async (foodId, rating) => {
  const response = await apiClient.post(`/ratings/foods/${foodId}`, { rating });
  return response.data;
};