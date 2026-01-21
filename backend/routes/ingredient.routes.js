import express from "express";
import { getAllIngredients } from "../controllers/ingredient.controller.js";

const router = express.Router();

router.get("/", getAllIngredients);

export default router;
