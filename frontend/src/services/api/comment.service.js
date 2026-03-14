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

export const updateComment = async (commentId, commentData) => {
  const response = await apiClient.put(`/comments/${commentId}`, commentData);
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await apiClient.delete(`/comments/${commentId}`);
  return response.data;
};