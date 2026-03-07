// src/services/api/comment.service.js
import apiClient from './client.js';

export const getCommentsByFood = async (foodId) => {
  const response = await apiClient.get(`/comments/foods/${foodId}`);
  return response.data;
};

export const addComment = async (foodId, commentData) => {
  const response = await apiClient.post(`/comments/foods/${foodId}`, commentData);
  return response.data;
};