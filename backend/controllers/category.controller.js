import Category from "../models/Category.js";
import Food from "../models/Food.js";

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: [Food],
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
