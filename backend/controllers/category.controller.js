import Category from "../../models/category.js";
import Food from "../../models/food.js";

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