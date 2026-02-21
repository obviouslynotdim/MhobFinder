import Food from "../models/food.js";
import Ingredient from "../models/ingredient.js";

export const getAllFoods = async (req, res, next) => {
  try {
    const foods = await Food.findAll({
      include: [{ model: Ingredient, through: { attributes: [] } }],
    });
    res.json(foods);
  } catch (err) {
    next(err);
  }
};

export const getMatchedFoods = async (req, res, next) => {
  try {
    const { ingredientIds } = req.body;
    if (!ingredientIds || !ingredientIds.length) return res.json([]);

    const foods = await Food.findAll({
      include: [
        {
          model: Ingredient,
          where: { ingredient_id: ingredientIds },
          through: { attributes: [] },
        },
      ],
    });

    res.json(foods);
  } catch (err) {
    next(err);
  }
};