import Favorite from "../models/Favorite.js";

export const getUserFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id: req.params.user_id },
    });
    res.json(favorites);
  } catch (err) {
    next(err);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const { user_id, food_id } = req.body;
    const favorite = await Favorite.create({ user_id, food_id });
    res.json(favorite);
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { user_id, food_id } = req.body;
    await Favorite.destroy({ where: { user_id, food_id } });
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    next(err);
  }
};
