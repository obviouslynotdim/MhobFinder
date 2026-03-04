import Ingredient from "../models/Ingredient.js";
import { IngredientType } from "../models/index.js"; 

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

export const getIngredientsByType = async (req, res, next) => {
  try {
    const { typeId } = req.params;   

    const ingredients = await Ingredient.findAll({
      where: { typeId },           
      include: [{ model: IngredientType, as: "type" }],
    });

    res.json(ingredients);
  } catch (err) {
    next(err);
  }
};
