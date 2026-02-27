import IngredientType from "../models/ingredientType.js";

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
    const { name } = req.body;
    const type = await IngredientType.create({ name });
    res.status(201).json(type);
  } catch (err) {
    next(err);
  }
};
