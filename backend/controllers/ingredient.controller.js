import Ingredient from "../models/Ingredient.js";
import { IngredientType } from "../models/index.js"; // use centralized export to avoid circular issues

export const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.findAll({
      include: [{ model: IngredientType, as: "type" }],
    });
    res.json(ingredients);
  } catch (err) {
    next(err);
  }
};
