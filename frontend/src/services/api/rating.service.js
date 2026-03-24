// src/services/api/rating.service.js
import apiClient from './client.js';

const RATING_CACHE_TTL_MS = 60 * 1000;
const ratingCache = new Map();

function toCacheKey(foodId) {
  return String(foodId);
}

export function invalidateRatingsCache(foodId) {
  if (foodId == null) {
    ratingCache.clear();
    return;
  }
  ratingCache.delete(toCacheKey(foodId));
}

export const getRatingsByFood = async (foodId, options = {}) => {
  const { forceRefresh = false } = options;
  const key = toCacheKey(foodId);

  if (!forceRefresh && ratingCache.has(key)) {
    const cached = ratingCache.get(key);
    if (Date.now() - cached.timestamp < RATING_CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const response = await apiClient.get(`/ratings/foods/${foodId}`);
  const data = response.data || [];

  ratingCache.set(key, {
    data,
    timestamp: Date.now(),
  });

  return data;
};

export const addOrUpdateRating = async (foodId, rating) => {
  const response = await apiClient.post(`/ratings/foods/${foodId}`, { rating });
  invalidateRatingsCache(foodId);
  return response.data;
};