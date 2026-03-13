// food.service.js

const API_BASE = import.meta.env.VITE_API_BASE || "";
// Example: "http://localhost:5000" if bypassing proxy

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
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
  formData.append("status", data.status);

  const res = await fetch(`${API_BASE}/api/foods/${foodId}`, {
    method: "PUT",
    credentials: "include",
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
  });
  return handleResponse(res);
};
