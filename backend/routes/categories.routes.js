import express from "express";
import {
  getAllCategories,
  getCategoryById,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getAllCategories); // GET all categories
router.get("/:id", getCategoryById); // GET category by ID

export default router;
