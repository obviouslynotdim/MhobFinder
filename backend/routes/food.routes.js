import express from "express";
import {
  getAllFoods,
  getMatchedFoods,
  getFoodById,
} from "../controllers/food.controller.js";

const router = express.Router();

router.get("/", getAllFoods); // GET all foods
router.get("/:id", getFoodById);

router.post("/match", getMatchedFoods); // POST ingredientIds to match foods
export default router;
