// ingredient.service.js
import { apiFetch } from "./fetchClient.js";

export const getAllIngredients = async () => {
  return apiFetch("/api/ingredients");
};