import { User, Food } from "../models/index.js";

export const getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: {
        model: Food,
        through: { attributes: [] }, 
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.Foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { userId, foodId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.addFood(foodId); // Sequelize magic method
    res.status(201).json({ message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { userId, foodId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.removeFood(foodId); // Sequelize magic method
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
