import express from "express";
import { getAllFoods, getMatchedFoods } from "../controllers/food.controller.js";

const router = express.Router();

router.get("/", getAllFoods);         // GET all foods
router.post("/match", getMatchedFoods); // POST ingredientIds to match foods

export default router;