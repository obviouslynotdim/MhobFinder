import { Food, Comment } from "../models/index.js";

export const getCommentsByFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    const food = await Food.findByPk(foodId, {
      include: {
        model: Food.associations.comments.target, // or simply: model: Comment
        as: "comments",
        include: {
          model: Food.sequelize.models.User,
          as: "user",
          attributes: ["user_id", "name"],
        },
      },
    });

    if (!food) return res.status(404).json({ error: "Food not found" });

    res.json(food.comments); // like user.FavoriteFoods
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { user_id, comment_text, parent_id } = req.body;

    const food = await Food.findByPk(foodId);
    if (!food) return res.status(404).json({ error: "Food not found" });

    const comment = await food.createComment({
      user_id,
      comment_text,
      parent_id,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    await comment.destroy();

    res.json({ message: "Comment removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
