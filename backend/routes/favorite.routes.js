import express from "express";
import { getUserFavorites, addFavorite, removeFavorite } from "../controllers/favorite.controller.js";

const router = express.Router();

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
router.get("/users/:userId", getUserFavorites);

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
router.post("/users/:userId/:foodId", addFavorite);

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
router.delete("/users/:userId/:foodId", removeFavorite);

export default router;