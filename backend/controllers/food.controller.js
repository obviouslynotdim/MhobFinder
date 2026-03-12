import Food from "../models/Food.js";
import Ingredient from "../models/Ingredient.js";
import { Op } from "sequelize";
import cloudinary from "../config/cloudinary.js";

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

// ---------------------------
// Create a new food with an image upload
// ---------------------------
export const createFood = async (req, res, next) => {
  try {
    const { title, description, link_url } = req.body;

    let image_url = null;
    let public_id = null;

    if (req.file) {
      // upload buffer to Cloudinary
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64",
      )}`;
      const result = await cloudinary.uploader.upload(fileStr, {
        folder: "foods",
      });
      image_url = result.secure_url;
      public_id = result.public_id;
    }

    const newFood = await Food.create({
      title,
      description,
      image_url,
      public_id,
      link_url,
    });

    res.status(201).json(newFood);
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// Update existing food (text fields and optionally image)
// ---------------------------
export const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, link_url } = req.body;

    const food = await Food.findByPk(id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // if there is a new file, handle Cloudinary replacement
    if (req.file) {
      if (food.public_id) {
        await cloudinary.uploader.destroy(food.public_id);
      }
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64",
      )}`;
      const result = await cloudinary.uploader.upload(fileStr, {
        folder: "foods",
      });
      food.image_url = result.secure_url;
      food.public_id = result.public_id;
    }

    food.title = title !== undefined ? title : food.title;
    food.description =
      description !== undefined ? description : food.description;
    food.link_url = link_url !== undefined ? link_url : food.link_url;

    await food.save();

    res.json(food);
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// Delete a food and its Cloudinary image
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
    res.json({ message: "Food deleted" });
  } catch (err) {
    next(err);
  }
};
