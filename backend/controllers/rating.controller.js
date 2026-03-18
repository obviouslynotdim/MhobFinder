import Rating from "../models/rating.js";
import { parsePositiveInt } from "../utils/validation.js";

export const getRatingsByFood = async (req, res, next) => {
  try {
    const foodId = parsePositiveInt(req.params?.foodId);
    if (!foodId) {
      return res.status(400).json({ message: "Invalid foodId" });
    }

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
    const foodId = parsePositiveInt(req.params?.foodId);
    const numericRating = Number(req.body?.rating);

    if (!foodId) {
      return res.status(400).json({ message: "Invalid foodId" });
    }

    if (Number.isNaN(numericRating)) {
      return res.status(400).json({ message: "rating is required" });
    }

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "rating must be between 1 and 5" });
    }

    await Rating.upsert({
      user_id: req.user.user_id,
      food_id: foodId,
      rating: numericRating,
    });

    res.status(200).json({ message: "Rating added or updated successfully" });
  } catch (err) {
    next(err);
  }
};
