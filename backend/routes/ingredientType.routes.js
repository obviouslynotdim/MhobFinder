import express from "express";
import {
  getAllIngredientTypes,
  createIngredientType,
  updateIngredientType,
  deleteIngredientType,
} from "../controllers/ingredientType.controller.js";
import { verifyFirebaseToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/ingredient-types:
 *   get:
 *     summary: Get all ingredient types
 *     responses:
 *       200:
 *         description: List of ingredient types
 */
router.get("/", getAllIngredientTypes);

/**
 * @swagger
 * /api/ingredient-types:
 *   post:
 *     summary: Create a new ingredient type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ingredient type created
 */
router.post("/", verifyFirebaseToken, requireAdmin, createIngredientType);
router.put("/:id", verifyFirebaseToken, requireAdmin, updateIngredientType);
router.delete("/:id", verifyFirebaseToken, requireAdmin, deleteIngredientType);

export default router;
