import express from "express";
import { getCommentsByFood, addComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/:foodId", getCommentsByFood);
router.post("/", addComment);

export default router;