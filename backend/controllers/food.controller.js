import Food from "../models/food.js";
import Ingredient from "../models/ingredient.js";
import Category from "../models/category.js";
import { Op } from "sequelize";
import cloudinary from "../config/cloudinary.js";
import { cleanText, parseIdArray, parsePositiveInt } from "../utils/validation.js";

// ---------------------------
// Helper: Upload to Cloudinary
// ---------------------------
const uploadImage = async (file) => {
  const fileStr = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64",
  )}`;

  const result = await cloudinary.uploader.upload(fileStr, {
    folder: "foods",
  });

  return {
    image_url: result.secure_url,
    public_id: result.public_id,
  };
};

const isValidHttpUrl = (value) => {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

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
        {
          model: Category,
          as: "categories",
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
    const id = parsePositiveInt(req.params?.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid food id" });
    }

    const food = await Food.findByPk(id, {
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          through: { attributes: [] },
        },
        {
          model: Category,
          as: "categories",
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
    const ingredientIds = parseIdArray(req.body?.ingredientIds);

    if (ingredientIds.length === 0) {
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

// ---------------------------
// Create Food
// ---------------------------
export const createFood = async (req, res, next) => {
  try {
    const title = cleanText(req.body?.title, 150);
    const description = cleanText(req.body?.description, 3000);
    const link_url = cleanText(req.body?.link_url, 2048);

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    if (req.body?.description != null && !description) {
      return res.status(400).json({ message: "description is too long or invalid" });
    }

    if (!isValidHttpUrl(link_url)) {
      return res.status(400).json({ message: "link_url must be a valid http(s) URL" });
    }

    let { ingredientIds, categoryIds } = req.body;

    ingredientIds = parseIdArray(ingredientIds);
    categoryIds = parseIdArray(categoryIds);

    let image_url = null;
    let public_id = null;

    if (req.file) {
      const upload = await uploadImage(req.file);
      image_url = upload.image_url;
      public_id = upload.public_id;
    }

    const newFood = await Food.create({
      title,
      description,
      image_url,
      public_id,
      link_url,
    });

    if (ingredientIds.length) {
      await newFood.setIngredients(ingredientIds);
    }

    if (categoryIds.length) {
      await newFood.setCategories(categoryIds);
    }

    const food = await Food.findByPk(newFood.id, {
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          through: { attributes: [] },
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
    });

    res.status(201).json(food);
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// Update Food
// ---------------------------
export const updateFood = async (req, res, next) => {
  try {
    const id = parsePositiveInt(req.params?.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid food id" });
    }

    const title = cleanText(req.body?.title, 150);
    const description = cleanText(req.body?.description, 3000);
    const link_url = cleanText(req.body?.link_url, 2048);
    let { ingredientIds, categoryIds } = req.body;

    if (req.body?.title != null && !title) {
      return res.status(400).json({ message: "title is invalid" });
    }

    if (req.body?.description != null && !description) {
      return res.status(400).json({ message: "description is too long or invalid" });
    }

    if (req.body?.link_url != null && !isValidHttpUrl(link_url)) {
      return res.status(400).json({ message: "link_url must be a valid http(s) URL" });
    }

    const food = await Food.findByPk(id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (req.file) {
      if (food.public_id) {
        await cloudinary.uploader.destroy(food.public_id);
      }

      const upload = await uploadImage(req.file);

      food.image_url = upload.image_url;
      food.public_id = upload.public_id;
    }

    if (req.body?.title != null) {
      food.title = title;
    }

    if (req.body?.description != null) {
      food.description = description;
    }

    if (req.body?.link_url != null) {
      food.link_url = link_url;
    }

    await food.save();

    const hasIngredientPayload = Object.prototype.hasOwnProperty.call(
      req.body,
      "ingredientIds",
    );
    const hasCategoryPayload = Object.prototype.hasOwnProperty.call(
      req.body,
      "categoryIds",
    );

    ingredientIds = parseIdArray(ingredientIds);
    categoryIds = parseIdArray(categoryIds);

    if (hasIngredientPayload) {
      await food.setIngredients(ingredientIds);
    }

    if (hasCategoryPayload) {
      await food.setCategories(categoryIds);
    }

    const updatedFood = await Food.findByPk(id, {
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          through: { attributes: [] },
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
    });

    res.json(updatedFood);
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// Delete Food
// ---------------------------
export const deleteFood = async (req, res, next) => {
  try {
    const id = parsePositiveInt(req.params?.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid food id" });
    }

    const food = await Food.findByPk(id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.public_id) {
      await cloudinary.uploader.destroy(food.public_id);
    }

    await food.destroy();

    res.json({ message: "Food deleted successfully" });
  } catch (err) {
    next(err);
  }
};
