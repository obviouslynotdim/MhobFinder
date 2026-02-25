// food.service.js
const API_BASE = import.meta.env.VITE_API_BASE || ""; // ex. "http://localhost:5000" if you want to bypass proxy


async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export const getAllFoods = async () => {
  const res = await fetch(`${API_BASE}/api/foods`, {
    credentials: "include",
  });
  return handleResponse(res);
};

export const getMatchedFoods = async (selectedIngredients = []) => {
  const res = await fetch(`${API_BASE}/api/foods/match`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredientIds: selectedIngredients }),
  });
  return handleResponse(res);
};