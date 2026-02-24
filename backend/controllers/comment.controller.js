import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const getCommentsByFood = async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: { food_id: req.params.foodId },
      include: [{ model: User, attributes: ["user_id", "name"] }],
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { user_id, food_id, parent_id, comment_text } = req.body;
    const comment = await Comment.create({
      user_id,
      food_id,
      parent_id,
      comment_text,
    });
    res.json(comment);
  } catch (err) {
    next(err);
  }
};
