import express from "express";
import { getUserFavorites, addFavorite, removeFavorite } from "../controllers/favorite.controller.js";

const router = express.Router();

router.get("/:user_id", getUserFavorites);
router.post("/", addFavorite);
router.delete("/", removeFavorite);

export default router;