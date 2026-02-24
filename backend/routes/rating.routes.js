import express from "express";
import { getRatingsByFood, addOrUpdateRating } from "../controllers/rating.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/ratings/foods/{foodId}:
 *   get:
 *     summary: Get all ratings for a food
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of ratings
 */
router.get("/foods/:foodId", getRatingsByFood);

/**
 * @swagger
 * /api/ratings/foods/{foodId}:
 *   post:
 *     summary: Add or update rating for a food
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
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
 *               rating:
 *                 type: number
 *                 example: 4.5
 *     responses:
 *       200:
 *         description: Rating added or updated
 */
router.post("/foods/:foodId", addOrUpdateRating);

export default router;
