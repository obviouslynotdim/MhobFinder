import Rating from "../models/Rating.js";

export const getRatingsByFood = async (req, res, next) => {
  try {
    const ratings = await Rating.findAll({
      where: { food_id: req.params.food_id },
    });
    res.json(ratings);
  } catch (err) {
    next(err);
  }
};

export const addOrUpdateRating = async (req, res, next) => {
  try {
    const { user_id, food_id, rating } = req.body;
    const [newRating, created] = await Rating.upsert({
      user_id,
      food_id,
      rating,
    });
    res.json(newRating);
  } catch (err) {
    next(err);
  }
};
