import express from "express";
import { getAllFoods, getMatchedFoods } from "../controllers/food.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/foods:
 *   get:
 *     summary: Get all foods
 *     responses:
 *       200:
 *         description: List of all foods
 */
router.get("/", getAllFoods);

/**
 * @swagger
 * /api/foods/match:
 *   post:
 *     summary: Get foods matching ingredients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredientIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: List of foods matching ingredients
 */
router.post("/match", getMatchedFoods);

export default router;