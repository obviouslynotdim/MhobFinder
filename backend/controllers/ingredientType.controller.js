import IngredientType from "../models/ingredientType.js";
import { cleanText } from "../utils/validation.js";

export const getAllIngredientTypes = async (req, res, next) => {
  try {
    const types = await IngredientType.findAll();
    res.json(types);
  } catch (err) {
    next(err);
  }
};

export const createIngredientType = async (req, res, next) => {
  try {
    const name = cleanText(req.body?.name, 100);
    if (!name) {
      return res.status(400).json({ message: "Valid name is required" });
    }

    const existing = await IngredientType.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "Ingredient type already exists" });
    }

    const type = await IngredientType.create({ name });
    res.status(201).json(type);
  } catch (err) {
    next(err);
  }
};
