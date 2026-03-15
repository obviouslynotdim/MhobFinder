import Rating from "../models/rating.js";

export const getRatingsByFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;

    const ratings = await Rating.findAll({
      where: { food_id: foodId },
    });

    res.json(ratings);
  } catch (err) {
    next(err);
  }
};

export const addOrUpdateRating = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { rating } = req.body;

    if (rating == null) {
      return res.status(400).json({ message: "rating is required" });
    }

    await Rating.upsert({
      user_id: req.user.user_id,
      food_id: foodId,
      rating,
    });

    res.status(200).json({ message: "Rating added or updated successfully" });
  } catch (err) {
    next(err);
  }
};
