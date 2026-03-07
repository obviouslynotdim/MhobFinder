import { User, Food } from "../models/index.js";

// ---------------------------
// Get user's favorite foods
// ---------------------------
export const getUserFavorites = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if user is accessing their own favorites
    if (req.user.user_id !== parseInt(userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Food,
          as: "FavoriteFoods",
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.FavoriteFoods);
  } catch (err) {
    next(err); // ✅ centralized error handling
  }
};

// ---------------------------
// Add favorite food
// ---------------------------
export const addFavorite = async (req, res, next) => {
  try {
    const { userId, foodId } = req.params;

    // Check if user is accessing their own favorites
    if (req.user.user_id !== parseInt(userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Optional: prevent duplicates
    await user.addFavoriteFood(foodId);

    res.status(201).json({ message: "Added to favorites" });
  } catch (err) {
    next(err);
  }
};

// ---------------------------
// Remove favorite food
// ---------------------------
export const removeFavorite = async (req, res, next) => {
  try {
    const { userId, foodId } = req.params;

    // Check if user is accessing their own favorites
    if (req.user.user_id !== parseInt(userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.removeFavoriteFood(foodId);

    res.json({ message: "Removed from favorites" });
  } catch (err) {
    next(err);
  }
};
