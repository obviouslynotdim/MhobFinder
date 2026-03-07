// src/services/api/favorite.service.js
import apiClient from './client.js';

export const getUserFavorites = async (userId) => {
  const response = await apiClient.get(`/favorites/users/${userId}`);
  return response.data;
};

export const addFavorite = async (userId, foodId) => {
  const response = await apiClient.post(`/favorites/users/${userId}/${foodId}`);
  return response.data;
};

export const removeFavorite = async (userId, foodId) => {
  const response = await apiClient.delete(`/favorites/users/${userId}/${foodId}`);
  return response.data;
};