import Ingredient from "../models/ingredient.js";

export const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.findAll();
    res.json(ingredients);
  } catch (err) {
    next(err);
  }
};