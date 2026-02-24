import Ingredient from "../models/Ingredient.js";

export const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.findAll();
    res.json(ingredients);
  } catch (err) {
    next(err);
  }
};
