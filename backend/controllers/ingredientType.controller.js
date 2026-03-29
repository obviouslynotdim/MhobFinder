import IngredientType from "../models/ingredientType.js";
import Ingredient from "../models/ingredient.js";
import { Op } from "sequelize";
import { cleanText } from "../utils/validation.js";
import { parsePositiveInt } from "../utils/validation.js";

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

export const updateIngredientType = async (req, res, next) => {
  try {
    const id = parsePositiveInt(req.params?.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid type id" });
    }

    const name = cleanText(req.body?.name, 100);
    if (!name) {
      return res.status(400).json({ message: "Valid name is required" });
    }

    const type = await IngredientType.findByPk(id);
    if (!type) {
      return res.status(404).json({ message: "Ingredient type not found" });
    }

    const existing = await IngredientType.findOne({
      where: {
        name,
        type_id: {
          [Op.ne]: id,
        },
      },
    });

    if (existing) {
      return res.status(409).json({ message: "Ingredient type already exists" });
    }

    await type.update({ name });
    res.json(type);
  } catch (err) {
    next(err);
  }
};

export const deleteIngredientType = async (req, res, next) => {
  try {
    const id = parsePositiveInt(req.params?.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid type id" });
    }

    const type = await IngredientType.findByPk(id);
    if (!type) {
      return res.status(404).json({ message: "Ingredient type not found" });
    }

    const linkedIngredient = await Ingredient.findOne({
      where: { type_id: id },
      attributes: ["ingredient_id"],
    });

    if (linkedIngredient) {
      return res.status(409).json({
        message: "Cannot delete ingredient type that still has ingredients",
      });
    }

    await type.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
