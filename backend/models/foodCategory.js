import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const FoodCategory = sequelize.define(
  "FoodCategory",
  {
    food_id: { type: DataTypes.INTEGER, primaryKey: true },
    category_id: { type: DataTypes.INTEGER, primaryKey: true },
  },
  {
    tableName: "food_categories",
    timestamps: false,
  },
);

export default FoodCategory;
