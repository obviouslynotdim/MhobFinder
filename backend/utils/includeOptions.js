import Category from "../models/category.js";
import Food from "../models/food.js";
import Ingredient from "../models/ingredient.js";
import User from "../models/user.js";
import { IngredientType } from "../models/index.js";

export const buildFoodFullInclude = () => [
  {
    model: Ingredient,
    as: "ingredients",
    through: { attributes: [] },
  },
  {
    model: Category,
    as: "categories",
    through: { attributes: [] },
  },
];

export const buildCategoryFoodsInclude = () => [
  {
    model: Food,
    as: "foods",
    through: { attributes: [] },
  },
];

export const buildIngredientTypeInclude = () => [
  {
    model: IngredientType,
    as: "type",
  },
];

export const buildBugReportAdminInclude = () => [
  {
    model: User,
    as: "reporter",
    attributes: ["user_id", "name", "email", "image_url"],
  },
  {
    model: Food,
    as: "food",
    attributes: ["food_id", "title", "image_url"],
  },
  {
    model: User,
    as: "handledBy",
    attributes: ["user_id", "name", "email"],
  },
];