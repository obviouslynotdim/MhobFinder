import Comment from "../models/comment.js";
import User from "../models/user.js";
import { cleanText, parsePositiveInt } from "../utils/validation.js";

export const getCommentsByFood = async (req, res, next) => {
  try {
    const foodId = parsePositiveInt(req.params?.foodId);
    if (!foodId) {
      return res.status(400).json({ message: "Invalid foodId" });
    }

    const comments = await Comment.findAll({
      where: { food_id: foodId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "name", "image_url"],
        },
        { model: Comment, as: "replies" }, // optional: include replies
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const foodId = parsePositiveInt(req.params?.foodId);
    const parentIdRaw = req.body?.parent_id;
    const parent_id = parentIdRaw == null ? null : parsePositiveInt(parentIdRaw);
    const comment_text = cleanText(req.body?.comment_text, 1500);

    if (!foodId) {
      return res.status(400).json({ message: "Invalid foodId" });
    }

    if (parentIdRaw != null && !parent_id) {
      return res.status(400).json({ message: "Invalid parent_id" });
    }

    if (parent_id != null) {
      const parentComment = await Comment.findByPk(parent_id);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }

      if (parentComment.food_id !== foodId) {
        return res.status(400).json({ message: "parent_id does not belong to this food" });
      }
    }

    if (!comment_text) {
      return res.status(400).json({ message: "comment_text is required" });
    }

    // Prevent spam: allow only one top-level review per user per food.
    // Users can still edit that review via updateComment.
    if (parent_id == null) {
      const existingReview = await Comment.findOne({
        where: {
          user_id: req.user.user_id,
          food_id: foodId,
          parent_id: null,
        },
      });

      if (existingReview) {
        return res.status(409).json({
          message: "You already reviewed this recipe. Please edit your existing review.",
          commentId: existingReview.comment_id,
        });
      }
    }

    const comment = await Comment.create({
      user_id: req.user.user_id,
      food_id: foodId,
      parent_id,
      comment_text,
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const commentId = parsePositiveInt(req.params?.commentId);
    const comment_text = cleanText(req.body?.comment_text, 1500);

    if (!commentId) {
      return res.status(400).json({ message: "Invalid commentId" });
    }

    if (!comment_text) {
      return res.status(400).json({ message: "comment_text is required" });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "You can only edit your own comment" });
    }

    comment.comment_text = comment_text;
    await comment.save();

    return res.json(comment);
  } catch (err) {
    return next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = parsePositiveInt(req.params?.commentId);
    if (!commentId) {
      return res.status(400).json({ message: "Invalid commentId" });
    }

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isOwner = comment.user_id === req.user.user_id;
    if (!isOwner && !req.userIsAdmin) {
      return res.status(403).json({ message: "You can only delete your own comment" });
    }

    await comment.destroy();
    return res.json({ message: "Comment deleted" });
  } catch (err) {
    return next(err);
  }
};
