// src/services/api/comment.service.js
import apiClient from './client.js';

const COMMENT_CACHE_TTL_MS = 60 * 1000;
const commentCache = new Map();

function toCacheKey(foodId) {
  return String(foodId);
}

export function invalidateCommentsCache(foodId) {
  if (foodId == null) {
    commentCache.clear();
    return;
  }
  commentCache.delete(toCacheKey(foodId));
}

export const getCommentsByFood = async (foodId, options = {}) => {
  const { forceRefresh = false } = options;
  const key = toCacheKey(foodId);

  if (!forceRefresh && commentCache.has(key)) {
    const cached = commentCache.get(key);
    if (Date.now() - cached.timestamp < COMMENT_CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const response = await apiClient.get(`/comments/foods/${foodId}`);
  const data = response.data || [];

  commentCache.set(key, {
    data,
    timestamp: Date.now(),
  });

  return data;
};

export const addComment = async (foodId, commentData) => {
  const response = await apiClient.post(`/comments/foods/${foodId}`, commentData);
  invalidateCommentsCache(foodId);
  return response.data;
};

export const updateComment = async (commentId, commentData) => {
  const response = await apiClient.put(`/comments/${commentId}`, commentData);
  invalidateCommentsCache();
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await apiClient.delete(`/comments/${commentId}`);
  invalidateCommentsCache();
  return response.data;
};