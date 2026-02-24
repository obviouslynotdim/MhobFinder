import Food from "../models/Food.js";
import Ingredient from "../models/Ingredient.js";

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

export const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const food = await Food.findByPk(id, {
      include: [{ model: Ingredient, through: { attributes: [] } }],
    });

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json(food);
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
