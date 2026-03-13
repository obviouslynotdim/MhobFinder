import Food from "../models/Food.js";
import Ingredient from "../models/Ingredient.js";
import Category from "../models/Category.js";
import { Op } from "sequelize";
import cloudinary from "../config/cloudinary.js";

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
    const { id } = req.params;

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

// ---------------------------
// Create Food
// ---------------------------
export const createFood = async (req, res, next) => {
  try {
    const { title, description, link_url } = req.body;

    let { ingredientIds, categoryIds } = req.body;

    // normalize arrays
    const parseIds = (data) => {
      if (!data) return [];

      if (typeof data === "string") {
        return data
          .split(",")
          .map((id) => parseInt(id))
          .filter(Boolean);
      }

      if (Array.isArray(data)) {
        return data.map((id) => parseInt(id)).filter(Boolean);
      }

      return [];
    };

    ingredientIds = parseIds(ingredientIds);
    categoryIds = parseIds(categoryIds);

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
    const { id } = req.params;
    const { title, description, link_url } = req.body;

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

    food.title = title ?? food.title;
    food.description = description ?? food.description;
    food.link_url = link_url ?? food.link_url;

    await food.save();

    res.json(food);
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// Delete Food
// ---------------------------
export const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;

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
