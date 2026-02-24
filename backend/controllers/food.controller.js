import Food from "../models/Food.js";
import Ingredient from "../models/Ingredient.js";
import { Op, Sequelize } from "sequelize";

// ---------------------------
// Get all foods with their ingredients
// ---------------------------
export const getAllFoods = async (req, res, next) => {
  try {
    const foods = await Food.findAll({
      include: [
        {
          model: Ingredient,
          as: "ingredients", // match alias in association
          through: { attributes: [] },
        },
      ],
    });
    res.json(foods);
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// Get a single food by ID with ingredients
// ---------------------------
export const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const food = await Food.findByPk(id, {
      include: [
        {
          model: Ingredient,
          as: "ingredients", // match alias in association
          through: { attributes: [] },
        },
      ],
    });

    if (!food) return res.status(404).json({ message: "Food not found" });

    res.json(food);
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// Get foods matching all selected ingredients
// ---------------------------
export const getMatchedFoods = async (req, res, next) => {
  try {
    const { ingredientIds } = req.body;

    if (!Array.isArray(ingredientIds) || !ingredientIds.length) {
      return res
        .status(400)
        .json({ message: "ingredientIds must be a non-empty array" });
    }

    if (ingredientIds.some(isNaN)) {
      return res
        .status(400)
        .json({ message: "All ingredient IDs must be numbers" });
    }

    // Step 1: find food_ids that match all ingredients
    const matchingFoodIds = await Food.findAll({
      attributes: ["food_id"],
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          attributes: [],
          where: { ingredient_id: { [Op.in]: ingredientIds } },
          through: { attributes: [] },
        },
      ],
      group: ["Food.food_id"],
      having: Sequelize.literal(
        `COUNT(DISTINCT ingredients.ingredient_id) = ${ingredientIds.length}`,
      ),
      raw: true,
    });

    const foodIds = matchingFoodIds.map((f) => f.food_id);
    if (!foodIds.length) return res.json([]);

    // Step 2: fetch full food objects with ingredients
    const foods = await Food.findAll({
      where: { food_id: { [Op.in]: foodIds } },
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          through: { attributes: [] },
        },
      ],
    });

    res.json(foods);
  } catch (err) {
    next(err);
  }
};
