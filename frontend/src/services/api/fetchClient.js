import { auth } from "../../firebase.js";

const API_BASE = (import.meta.env.VITE_API_BASE || "")
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

const parseResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
};

export const createUrl = (path) => `${API_BASE}${path}`;

export const getAuthHeaders = async () => {
  if (!auth.currentUser) return {};
  const token = await auth.currentUser.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const apiFetch = async (path, options = {}) => {
  const res = await fetch(createUrl(path), {
    credentials: "include",
    ...options,
  });

  return parseResponse(res);
};
