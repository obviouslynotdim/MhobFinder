import express from "express";
import {
  getAllFoods,
  getMatchedFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/food.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllFoods); // GET all foods
router.get("/:id", getFoodById);

// CRUD endpoints with image handling
router.post("/", upload.single("image"), createFood);
router.put("/:id", upload.single("image"), updateFood);
router.delete("/:id", deleteFood);

router.post("/match", getMatchedFoods); // POST ingredientIds to match foods
export default router;
