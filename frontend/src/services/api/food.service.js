// food.service.js
import { auth } from "../../firebase.js";

const API_BASE = import.meta.env.VITE_API_BASE || "";
// Example: "http://localhost:5000" if bypassing proxy

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

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

async function getAuthHeaders() {
  if (!auth.currentUser) return {};
  const token = await auth.currentUser.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}

// ---------------------------
// Get all foods
// ---------------------------
export const getAllFoods = async () => {
  const res = await fetch(`${API_BASE}/api/foods`, {
    credentials: "include",
  });

  return handleResponse(res);
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
  const res = await fetch(`${API_BASE}/api/foods/match`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ingredientIds: selectedIngredients,
    }),
  });

  return handleResponse(res);
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
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);

  if (Array.isArray(ingredientIds)) {
    ingredientIds.forEach((id) => {
      formData.append("ingredientIds", id);
    });
  }

  if (Array.isArray(categoryIds) && categoryIds.length > 0) {
    categoryIds.forEach((id) => {
      formData.append("categoryIds", id);
    });
  }

  if (link_url) {
    formData.append("link_url", link_url);
  }

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(`${API_BASE}/api/foods`, {
    method: "POST",
    credentials: "include",
    headers: await getAuthHeaders(),
    body: formData,
  });

  return handleResponse(res);
};

// ---------------------------
// Get food by ID
// ---------------------------
export const getFoodById = async (foodId) => {
  const res = await fetch(`${API_BASE}/api/foods/${foodId}`, {
    credentials: "include",
  });
  return handleResponse(res);
};

// ---------------------------
// Update food
// ---------------------------
export const updateFood = async (foodId, data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  if (Array.isArray(data.ingredientIds)) {
    data.ingredientIds.forEach((id) => {
      formData.append("ingredientIds", id);
    });
  }
  if (Array.isArray(data.categoryIds) && data.categoryIds.length > 0) {
    data.categoryIds.forEach((id) => {
      formData.append("categoryIds", id);
    });
  }
  if (data.link_url) {
    formData.append("link_url", data.link_url);
  }
  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  const res = await fetch(`${API_BASE}/api/foods/${foodId}`, {
    method: "PUT",
    credentials: "include",
    headers: await getAuthHeaders(),
    body: formData,
  });
  return handleResponse(res);
};

// ---------------------------
// Delete food
// ---------------------------
export const deleteFood = async (foodId) => {
  const res = await fetch(`${API_BASE}/api/foods/${foodId}`, {
    method: "DELETE",
    credentials: "include",
    headers: await getAuthHeaders(),
  });
  return handleResponse(res);
};
