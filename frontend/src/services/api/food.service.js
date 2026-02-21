// food.service.js
import { dummyFoods } from "../../mock/mockFoods";

export const getAllFoods = async () => {
  await new Promise(r => setTimeout(r, 300));
  return dummyFoods;
};

export const getMatchedFoods = async (selectedIngredients = []) => {
  await new Promise(r => setTimeout(r, 300));
  if (!selectedIngredients.length) return dummyFoods;

  return dummyFoods.filter(food =>
    food.ingredients.some(id => selectedIngredients.includes(id))
  );
};