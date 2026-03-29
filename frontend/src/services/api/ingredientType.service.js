import { apiFetch, getAuthHeaders } from "./fetchClient.js";

const INGREDIENT_TYPES_CACHE_TTL_MS = 60 * 1000;
const ingredientTypesCache = {
  data: null,
  timestamp: 0,
};

const readIngredientTypesCache = () => {
  if (!Array.isArray(ingredientTypesCache.data)) return null;
  const isFresh = Date.now() - ingredientTypesCache.timestamp < INGREDIENT_TYPES_CACHE_TTL_MS;
  return isFresh ? ingredientTypesCache.data : null;
};

const writeIngredientTypesCache = (types) => {
  ingredientTypesCache.data = types;
  ingredientTypesCache.timestamp = Date.now();
};

export const invalidateIngredientTypesCache = () => {
  ingredientTypesCache.data = null;
  ingredientTypesCache.timestamp = 0;
};

export const getAllIngredientTypes = async (options = {}) => {
  const { forceRefresh = false } = options;

  if (!forceRefresh) {
    const cached = readIngredientTypesCache();
    if (cached) return cached;
  }

  const types = await apiFetch("/api/ingredient-types");
  const safeTypes = Array.isArray(types) ? types : [];
  writeIngredientTypesCache(safeTypes);
  return safeTypes;
};

export const createIngredientType = async (payload) => {
  const result = await apiFetch("/api/ingredient-types", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(payload),
  });

  invalidateIngredientTypesCache();
  return result;
};

export const updateIngredientType = async (id, payload) => {
  const result = await apiFetch(`/api/ingredient-types/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(payload),
  });

  invalidateIngredientTypesCache();
  return result;
};

export const deleteIngredientType = async (id) => {
  const result = await apiFetch(`/api/ingredient-types/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  invalidateIngredientTypesCache();
  return result;
};
