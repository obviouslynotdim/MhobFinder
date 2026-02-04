import express from "express";
import { getAllFoods, getMatchedFoods } from "../../frontend/controllers/food.controller.js";

const router = express.Router();

router.get("/", getAllFoods);
router.post("/match", getMatchedFoods); 

export default router;