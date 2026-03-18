import { apiFetch } from "./fetchClient.js";

export const getAllCategories = async () => {
  return apiFetch("/api/categories");
};
