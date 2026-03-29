import express from "express";
import {
	getAllIngredients,
	createIngredient,
	updateIngredient,
	deleteIngredient,
} from "../controllers/ingredient.controller.js";
import { verifyFirebaseToken, requireAdmin } from "../middleware/auth.js";

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
router.post("/", verifyFirebaseToken, requireAdmin, createIngredient);
router.put("/:id", verifyFirebaseToken, requireAdmin, updateIngredient);
router.delete("/:id", verifyFirebaseToken, requireAdmin, deleteIngredient);

export default router;
