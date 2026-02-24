import Category from "../models/Category.js";
import Food from "../models/Food.js";

// Get all categories with foods
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Food,
          as: "foods", // ✅ must match Category.belongsToMany(Food, { as: "foods" })
          through: { attributes: [] },
        },
      ],
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// Get a single category by ID with foods
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [
        {
          model: Food,
          as: "foods", // ✅ must match the alias
          through: { attributes: [] },
        },
      ],
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    next(err);
  }
};
