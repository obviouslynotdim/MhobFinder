import express from "express";
import { getCommentsByFood, addComment } from "../controllers/comment.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/comments/foods/{foodId}:
 *   get:
 *     summary: Get all comments for a food
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the food
 *     responses:
 *       200:
 *         description: List of comments for the food
 */
router.get("/foods/:foodId", getCommentsByFood);

/**
 * @swagger
 * /api/comments/foods/{foodId}:
 *   post:
 *     summary: Add a comment to a food
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the food
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               comment_text:
 *                 type: string
 *                 example: "This food is delicious!"
 *               parent_id:
 *                 type: integer
 *                 example: null
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post("/foods/:foodId", addComment);

export default router;