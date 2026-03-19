import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const FoodIngredient = sequelize.define(
  "FoodIngredient",
  {
    food_id: { type: DataTypes.INTEGER, primaryKey: true },
    ingredient_id: { type: DataTypes.INTEGER, primaryKey: true },
  },
  {
    tableName: "food_ingredients",
    timestamps: false,
  },
);

export default FoodIngredient;
