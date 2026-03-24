import Ingredient from "../models/ingredient.js";
import { parsePositiveInt } from "../utils/validation.js";
import { buildIngredientTypeInclude } from "../utils/includeOptions.js";

export const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.findAll({
      include: buildIngredientTypeInclude(),
    });
    res.json(ingredients);
  } catch (err) {
    next(err);
  }
};

export const getIngredientsByType = async (req, res, next) => {
  try {
    const typeId = parsePositiveInt(req.params?.typeId);
    if (!typeId) {
      return res.status(400).json({ message: "Invalid typeId" });
    }

    const ingredients = await Ingredient.findAll({
      where: { type_id: typeId },
      include: buildIngredientTypeInclude(),
    });

    res.json(ingredients);
  } catch (err) {
    next(err);
  }
};
