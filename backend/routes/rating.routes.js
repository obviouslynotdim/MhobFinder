import express from "express";
import { getRatingsByFood, addOrUpdateRating } from "../controllers/rating.controller.js";

const router = express.Router();

router.get("/:food_id", getRatingsByFood);
router.post("/", addOrUpdateRating);

export default router;