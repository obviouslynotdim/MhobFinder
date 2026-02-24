import express from "express";
import { getAllIngredients } from "../controllers/ingredient.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/ingredients:
 *   get:
 *     summary: Get all ingredients
 *     responses:
 *       200:
 *         description: List of all ingredients
 */
router.get("/", getAllIngredients);

export default router;
