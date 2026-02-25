import Food from "../models/Food.js";
import Ingredient from "../models/Ingredient.js";
import { Op } from "sequelize";

// ---------------------------
// Get all foods
// ---------------------------
export const getAllFoods = async (req, res, next) => {
  try {
    const foods = await Food.findAll({
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          through: { attributes: [] },
        },
      ],
      distinct: true,
    });

    res.json(foods);
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// Get food by ID
// ---------------------------
export const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const food = await Food.findByPk(id, {
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          through: { attributes: [] },
        },
      ],
    });

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json(food);
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// Get foods matched by ingredients
// ---------------------------
export const getMatchedFoods = async (req, res, next) => {
  try {
    const { ingredientIds } = req.body;

    if (!Array.isArray(ingredientIds) || ingredientIds.length === 0) {
      return res.json([]);
    }

    const foods = await Food.findAll({
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          where: {
            ingredient_id: {
              [Op.in]: ingredientIds,
            },
          },
          through: { attributes: [] },
        },
      ],
      distinct: true,
    });

    res.json(foods);
  } catch (err) {
    next(err);
  }
};
