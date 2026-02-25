// ingredient.service.js
const API_BASE = import.meta.env.VITE_API_BASE || ""; // override to full URL if necessary

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export const getAllIngredients = async () => {
  const res = await fetch(`${API_BASE}/api/ingredients`, {
    credentials: "include",
  });
  return handleResponse(res);
};