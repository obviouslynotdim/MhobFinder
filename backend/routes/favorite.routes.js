import express from "express";
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favorite.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

// ---------------------------
// Routes
// ---------------------------
router.get("/users/:userId", verifyFirebaseToken, getUserFavorites);
router.post("/users/:userId/:foodId", verifyFirebaseToken, addFavorite);
router.delete("/users/:userId/:foodId", verifyFirebaseToken, removeFavorite);

// ---------------------------
// Swagger Documentation
// ---------------------------
/**
 * @swagger
 * /api/favorites/users/{userId}:
 *   get:
 *     summary: Get all favorite foods of a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of favorite foods
 */

/**
 * @swagger
 * /api/favorites/users/{userId}/{foodId}:
 *   post:
 *     summary: Add a food to user's favorites
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Food added to favorites
 */

/**
 * @swagger
 * /api/favorites/users/{userId}/{foodId}:
 *   delete:
 *     summary: Remove a food from user's favorites
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Food removed from favorites
 */

export default router;
