// food.service.js
import { apiFetch, getAuthHeaders } from "./fetchClient.js";

const HOME_FOODS_CACHE_KEY = "mhob:home-foods:v1";
const HOME_FOODS_CACHE_TTL_MS = 5 * 60 * 1000;
const HOME_FOODS_CACHE_LIMIT = 30;

function readHomeFoodsCache() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(HOME_FOODS_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const isExpired = Date.now() - parsed.timestamp > HOME_FOODS_CACHE_TTL_MS;

    if (isExpired || !Array.isArray(parsed.foods)) {
      window.localStorage.removeItem(HOME_FOODS_CACHE_KEY);
      return null;
    }

    return parsed.foods;
  } catch {
    return null;
  }
}

function writeHomeFoodsCache(foods) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      HOME_FOODS_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        foods,
      })
    );
  } catch {
    // Ignore storage failures and keep request flow functional.
  }
}

export function invalidateHomeFoodsCache() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HOME_FOODS_CACHE_KEY);
}

const appendIdArray = (formData, key, ids = []) => {
  if (!Array.isArray(ids)) return;
  ids.forEach((id) => {
    formData.append(key, id);
  });
};

const buildFoodFormData = ({
  title,
  description,
  ingredientIds,
  categoryIds,
  link_url,
  imageFile,
}) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  appendIdArray(formData, "ingredientIds", ingredientIds);
  appendIdArray(formData, "categoryIds", categoryIds);

  if (link_url) {
    formData.append("link_url", link_url);
  }

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formData;
};

// ---------------------------
// Get all foods
// ---------------------------
export const getAllFoods = async () => {
  return apiFetch("/api/foods");
};

// ---------------------------
// Get home foods (cached + capped)
// ---------------------------
export const getHomeFoods = async ({ forceRefresh = false } = {}) => {
  if (!forceRefresh) {
    const cachedFoods = readHomeFoodsCache();
    if (cachedFoods) return cachedFoods;
  }

  const foods = await getAllFoods();
  const cappedFoods = Array.isArray(foods)
    ? foods.slice(0, HOME_FOODS_CACHE_LIMIT)
    : [];

  writeHomeFoodsCache(cappedFoods);
  return cappedFoods;
};

// ---------------------------
// Get foods matched by ingredients
// ---------------------------
export const getMatchedFoods = async (selectedIngredients = []) => {
  return apiFetch("/api/foods/match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ingredientIds: selectedIngredients,
    }),
  });
};

// ---------------------------
// Add a new food
// (Send FormData so backend can upload image)
// ---------------------------
export const addFood = async ({
  title,
  description,
  ingredientIds,
  categoryIds,
  link_url,
  imageFile,
}) => {
  const formData = buildFoodFormData({
    title,
    description,
    ingredientIds,
    categoryIds,
    link_url,
    imageFile,
  });

  return apiFetch("/api/foods", {
    method: "POST",
    headers: await getAuthHeaders(),
    body: formData,
  });
};

// ---------------------------
// Get food by ID
// ---------------------------
export const getFoodById = async (foodId) => {
  return apiFetch(`/api/foods/${foodId}`);
};

// ---------------------------
// Update food
// ---------------------------
export const updateFood = async (foodId, data) => {
  const formData = buildFoodFormData(data);

  return apiFetch(`/api/foods/${foodId}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: formData,
  });
};

// ---------------------------
// Delete food
// ---------------------------
export const deleteFood = async (foodId) => {
  return apiFetch(`/api/foods/${foodId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });
};
