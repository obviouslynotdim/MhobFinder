const API_BASE = import.meta.env.VITE_API_BASE || "";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export const getAllCategories = async () => {
  const res = await fetch(`${API_BASE}/api/categories`, {
    credentials: "include",
  });

  return handleResponse(res);
};
