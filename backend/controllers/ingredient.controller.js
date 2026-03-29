import Ingredient from "../models/ingredient.js";
import IngredientType from "../models/ingredientType.js";
import { Op } from "sequelize";
import { parsePositiveInt } from "../utils/validation.js";
import { cleanText } from "../utils/validation.js";
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

export const createIngredient = async (req, res, next) => {
  try {
    const name = cleanText(req.body?.name, 100);
    const typeId = parsePositiveInt(req.body?.type_id ?? req.body?.typeId);

    if (!name) {
      return res.status(400).json({ message: "Valid ingredient name is required" });
    }

    if (!typeId) {
      return res.status(400).json({ message: "Valid type_id is required" });
    }

    const type = await IngredientType.findByPk(typeId);
    if (!type) {
      return res.status(404).json({ message: "Ingredient type not found" });
    }

    const existing = await Ingredient.findOne({
      where: {
        name,
        type_id: typeId,
      },
    });

    if (existing) {
      return res.status(409).json({ message: "Ingredient already exists in this type" });
    }

    const created = await Ingredient.create({
      name,
      type_id: typeId,
    });

    const ingredient = await Ingredient.findByPk(created.ingredient_id, {
      include: buildIngredientTypeInclude(),
    });

    res.status(201).json(ingredient);
  } catch (err) {
    next(err);
  }
};

export const updateIngredient = async (req, res, next) => {
  try {
    const id = parsePositiveInt(req.params?.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid ingredient id" });
    }

    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    const hasNameInput = Object.prototype.hasOwnProperty.call(req.body || {}, "name");
    const hasTypeInput =
      Object.prototype.hasOwnProperty.call(req.body || {}, "type_id") ||
      Object.prototype.hasOwnProperty.call(req.body || {}, "typeId");

    if (!hasNameInput && !hasTypeInput) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    let nextName = ingredient.name;
    let nextTypeId = ingredient.type_id;

    if (hasNameInput) {
      const cleanedName = cleanText(req.body?.name, 100);
      if (!cleanedName) {
        return res.status(400).json({ message: "Valid ingredient name is required" });
      }
      nextName = cleanedName;
    }

    if (hasTypeInput) {
      const parsedTypeId = parsePositiveInt(req.body?.type_id ?? req.body?.typeId);
      if (!parsedTypeId) {
        return res.status(400).json({ message: "Valid type_id is required" });
      }

      const type = await IngredientType.findByPk(parsedTypeId);
      if (!type) {
        return res.status(404).json({ message: "Ingredient type not found" });
      }
      nextTypeId = parsedTypeId;
    }

    const duplicate = await Ingredient.findOne({
      where: {
        name: nextName,
        type_id: nextTypeId,
        ingredient_id: {
          [Op.ne]: id,
        },
      },
    });

    if (duplicate) {
      return res.status(409).json({ message: "Ingredient already exists in this type" });
    }

    await ingredient.update({
      name: nextName,
      type_id: nextTypeId,
    });

    const updated = await Ingredient.findByPk(id, {
      include: buildIngredientTypeInclude(),
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteIngredient = async (req, res, next) => {
  try {
    const id = parsePositiveInt(req.params?.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid ingredient id" });
    }

    const ingredient = await Ingredient.findByPk(id, {
      include: [
        {
          association: "foods",
          attributes: ["food_id"],
          through: { attributes: [] },
        },
      ],
    });

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    if (Array.isArray(ingredient.foods) && ingredient.foods.length > 0) {
      return res.status(409).json({
        message: "Cannot delete ingredient that is used by recipes",
      });
    }

    await ingredient.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
