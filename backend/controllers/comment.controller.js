import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const getCommentsByFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const comments = await Comment.findAll({
      where: { food_id: foodId },
      include: [
        { model: User, as: "user", attributes: ["user_id", "name"] },
        { model: Comment, as: "replies" }, // optional: include replies
      ],
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { user_id, parent_id, comment_text } = req.body;
    const { foodId } = req.params;

    const comment = await Comment.create({
      user_id,
      food_id: foodId,
      parent_id,
      comment_text,
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};
