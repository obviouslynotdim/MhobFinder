// ingredient.service.js
import { apiFetch, getAuthHeaders } from "./fetchClient.js";

const INGREDIENTS_CACHE_TTL_MS = 60 * 1000;
const ingredientsCache = {
  data: null,
  timestamp: 0,
};

const readIngredientsCache = () => {
  if (!Array.isArray(ingredientsCache.data)) return null;
  const isFresh = Date.now() - ingredientsCache.timestamp < INGREDIENTS_CACHE_TTL_MS;
  return isFresh ? ingredientsCache.data : null;
};

const writeIngredientsCache = (ingredients) => {
  ingredientsCache.data = ingredients;
  ingredientsCache.timestamp = Date.now();
};

export const invalidateIngredientsCache = () => {
  ingredientsCache.data = null;
  ingredientsCache.timestamp = 0;
};

export const getAllIngredients = async (options = {}) => {
  const { forceRefresh = false } = options;

  if (!forceRefresh) {
    const cached = readIngredientsCache();
    if (cached) return cached;
  }

  const ingredients = await apiFetch("/api/ingredients");
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];
  writeIngredientsCache(safeIngredients);
  return safeIngredients;
};

export const createIngredient = async (payload) => {
  const result = await apiFetch("/api/ingredients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(payload),
  });

  invalidateIngredientsCache();
  return result;
};

export const updateIngredient = async (id, payload) => {
  const result = await apiFetch(`/api/ingredients/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(payload),
  });

  invalidateIngredientsCache();
  return result;
};

export const deleteIngredient = async (id) => {
  const result = await apiFetch(`/api/ingredients/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  invalidateIngredientsCache();
  return result;
};