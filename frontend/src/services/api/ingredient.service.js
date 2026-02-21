// ingredient.service.js
import { dummyIngredients } from "../../mock/mockIngredients";

export const getAllIngredients = async () => {
  await new Promise(r => setTimeout(r, 200));
  return dummyIngredients;
};